import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { loadConfig } from "./config.js";
import { createProvider } from "./providers/factory.js";
import { parseIdlTool, ParseIdlSchema } from "./tools/parse-idl.js";
import {
  generateTsClientTool,
  GenerateTsClientSchema,
} from "./tools/generate-ts-client.js";
import {
  generateRustAccountsTool,
  GenerateRustAccountsSchema,
} from "./tools/generate-rust-accounts.js";
import { generateTestsTool, GenerateTestsSchema } from "./tools/generate-tests.js";
import {
  generateProgramTool,
  GenerateProgramSchema,
} from "./tools/generate-program.js";

const tools: Tool[] = [
  {
    name: "parse_idl",
    description:
      "Parse and summarize an Anchor IDL JSON file. Returns program info, instruction names, account types, and errors.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idl_path: {
          type: "string",
          description: "Path to target/idl/*.json file",
        },
      },
      required: ["idl_path"],
    },
  },
  {
    name: "generate_ts_client",
    description:
      "Generate a complete TypeScript client for an Anchor program. Includes typed instruction callers, PDA helpers, and account fetchers.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idl_path: {
          type: "string",
          description: "Path to target/idl/*.json file",
        },
        output_path: {
          type: "string",
          description: "Optional path to write generated client",
        },
      },
      required: ["idl_path"],
    },
  },
  {
    name: "generate_rust_accounts",
    description:
      "Generate a #[derive(Accounts)] struct for a specific instruction. Includes constraints, space calculation, and comments.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idl_path: {
          type: "string",
          description: "Path to target/idl/*.json file",
        },
        instruction_name: {
          type: "string",
          description: "Name of the instruction from the IDL",
        },
      },
      required: ["idl_path", "instruction_name"],
    },
  },
  {
    name: "generate_tests",
    description:
      "Generate a complete test suite for an Anchor program. Creates test scaffolds for all instructions using Mocha/Chai.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idl_path: {
          type: "string",
          description: "Path to target/idl/*.json file",
        },
        test_framework: {
          type: "string",
          enum: ["mocha", "jest"],
          description: "Test framework to use (default: mocha)",
        },
      },
      required: ["idl_path"],
    },
  },
  {
    name: "generate_program",
    description:
      "Generate a complete Anchor program from a natural language description. Creates lib.rs, account structs, error enums, and instruction handlers.",
    inputSchema: {
      type: "object" as const,
      properties: {
        description: {
          type: "string",
          description:
            "Natural language description of what the program should do",
        },
        program_name: {
          type: "string",
          description: "Name of the program in snake_case",
        },
      },
      required: ["description", "program_name"],
    },
  },
];

async function main() {
  const config = loadConfig();
  const provider = createProvider(config);

  const server = new Server({
    name: "anchor-scaffold-mcp",
    version: "0.1.0",
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result: string;

      switch (name) {
        case "parse_idl":
          result = await parseIdlTool(
            ParseIdlSchema.parse(args as Record<string, unknown>)
          );
          break;

        case "generate_ts_client":
          result = await generateTsClientTool(
            GenerateTsClientSchema.parse(args as Record<string, unknown>),
            provider
          );
          break;

        case "generate_rust_accounts":
          result = await generateRustAccountsTool(
            GenerateRustAccountsSchema.parse(args as Record<string, unknown>),
            provider
          );
          break;

        case "generate_tests":
          result = await generateTestsTool(
            GenerateTestsSchema.parse(args as Record<string, unknown>),
            provider
          );
          break;

        case "generate_program":
          result = await generateProgramTool(
            GenerateProgramSchema.parse(args as Record<string, unknown>),
            provider
          );
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [
          {
            type: "text" as const,
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
