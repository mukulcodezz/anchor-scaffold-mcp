#!/usr/bin/env node

import { parseArgs } from "util";
import { writeFileSync } from "fs";
import { resolve, relative, isAbsolute } from "path";
import { loadConfig } from "./config.js";
import { createProvider } from "./providers/factory.js";
import {
  validateIdlPath,
  validateInstructionName,
  validateProgramName,
  validateDescription,
  ValidationResult,
} from "./validation.js";
import { parseIdlTool } from "./tools/parse-idl.js";
import { generateTsClientTool } from "./tools/generate-ts-client.js";
import { generateRustAccountsTool } from "./tools/generate-rust-accounts.js";
import { generateTestsTool } from "./tools/generate-tests.js";
import { generateProgramTool } from "./tools/generate-program.js";

const options = {
  command: { type: "string" as const, short: "c" },
  idl: { type: "string" as const },
  instruction: { type: "string" as const },
  output: { type: "string" as const, short: "o" },
  description: { type: "string" as const },
  "program-name": { type: "string" as const },
  "test-framework": { type: "string" as const },
  help: { type: "boolean" as const, short: "h" },
  verbose: { type: "boolean" as const, short: "v" },
};

const { values, positionals } = parseArgs({ options, allowPositionals: true });

if (values.help) {
  console.log(`
Anchor Scaffold CLI - AI code generation for Anchor programs

Usage: anchor-scaffold <command> [options]

Commands:
  parse-idl              Parse and summarize an IDL file
  gen-ts-client          Generate TypeScript client
  gen-rust-accounts      Generate Rust accounts struct
  gen-tests              Generate test suite
  gen-program            Generate complete Anchor program

Options:
  -c, --command       Command to run
  --idl <path>        Path to IDL JSON file
  --instruction <name> Instruction name (for gen-rust-accounts)
  -o, --output <path> Output file path
  --description <text> Program description (for gen-program)
  --program-name <name> Program name (for gen-program)
  --test-framework <framework> Test framework: mocha or jest
  -v, --verbose       Verbose output
  -h, --help          Show this help

Examples:
  anchor-scaffold parse-idl --idl target/idl/my_program.json
  anchor-scaffold gen-ts-client --idl target/idl/my_program.json --output src/client.ts
  anchor-scaffold gen-program --description "A vault for SOL" --program-name token_vault
`);
  process.exit(0);
}

function check(result: ValidationResult): void {
  if (!result.isValid()) {
    throw new Error(result.toString());
  }
}

function safeOutputPath(output: string): string {
  const target = resolve(process.cwd(), output);
  const rel = relative(process.cwd(), target);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(
      `--output must stay inside the current directory: ${output}`
    );
  }
  return target;
}

async function main() {
  try {
    const command = values.command || positionals[0];

    if (!command) {
      console.error("Error: No command specified");
      console.error("Run with --help for usage");
      process.exit(1);
    }

    // parse-idl is pure local — no provider/API key needed.
    const getProvider = () => createProvider(loadConfig());

    let result: string = "";

    switch (command) {
      case "parse-idl": {
        check(validateIdlPath(values.idl ?? ""));
        result = await parseIdlTool({ idl_path: values.idl! });
        break;
      }

      case "gen-ts-client": {
        check(validateIdlPath(values.idl ?? ""));
        result = await generateTsClientTool(
          { idl_path: values.idl!, output_path: values.output },
          getProvider()
        );
        break;
      }

      case "gen-rust-accounts": {
        check(validateIdlPath(values.idl ?? ""));
        check(validateInstructionName(values.instruction ?? ""));
        result = await generateRustAccountsTool(
          { idl_path: values.idl!, instruction_name: values.instruction! },
          getProvider()
        );
        break;
      }

      case "gen-tests": {
        check(validateIdlPath(values.idl ?? ""));
        result = await generateTestsTool(
          {
            idl_path: values.idl!,
            test_framework: (values["test-framework"] as "mocha" | "jest") || "mocha",
          },
          getProvider()
        );
        break;
      }

      case "gen-program": {
        check(validateDescription(values.description ?? ""));
        check(validateProgramName(values["program-name"] ?? ""));
        result = await generateProgramTool(
          {
            description: values.description!,
            program_name: values["program-name"]!,
          },
          getProvider()
        );
        break;
      }

      default:
        throw new Error(`Unknown command: ${command}`);
    }

    if (values.output) {
      const target = safeOutputPath(values.output);
      writeFileSync(target, result);
      if (values.verbose) {
        console.error(`✓ Written to ${target}`);
      }
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  }
}

main();
