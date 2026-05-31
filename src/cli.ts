#!/usr/bin/env node

import { parseArgs } from "util";
import { createWriteStream } from "fs";
import { loadConfig } from "./config.js";
import { createProvider } from "./providers/factory.js";
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

async function main() {
  try {
    const command = values.command || positionals[0];
    const config = loadConfig();
    const provider = createProvider(config);

    if (!command) {
      console.error("Error: No command specified");
      console.error("Run with --help for usage");
      process.exit(1);
    }

    let result: string = "";

    switch (command) {
      case "parse-idl": {
        if (!values.idl) throw new Error("--idl required");
        result = await parseIdlTool({ idl_path: values.idl });
        break;
      }

      case "gen-ts-client": {
        if (!values.idl) throw new Error("--idl required");
        result = await generateTsClientTool(
          { idl_path: values.idl, output_path: values.output },
          provider
        );
        break;
      }

      case "gen-rust-accounts": {
        if (!values.idl) throw new Error("--idl required");
        if (!values.instruction) throw new Error("--instruction required");
        result = await generateRustAccountsTool(
          { idl_path: values.idl, instruction_name: values.instruction },
          provider
        );
        break;
      }

      case "gen-tests": {
        if (!values.idl) throw new Error("--idl required");
        result = await generateTestsTool(
          {
            idl_path: values.idl,
            test_framework: (values["test-framework"] as "mocha" | "jest") || "mocha",
          },
          provider
        );
        break;
      }

      case "gen-program": {
        if (!values.description) throw new Error("--description required");
        if (!values["program-name"]) throw new Error("--program-name required");
        result = await generateProgramTool(
          {
            description: values.description,
            program_name: values["program-name"],
          },
          provider
        );
        break;
      }

      default:
        throw new Error(`Unknown command: ${command}`);
    }

    if (values.output) {
      const stream = createWriteStream(values.output);
      stream.write(result);
      stream.end();
      if (values.verbose) {
        console.error(`✓ Written to ${values.output}`);
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
