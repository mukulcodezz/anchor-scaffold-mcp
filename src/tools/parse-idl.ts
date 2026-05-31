import { parseIdl } from "../parsers/idl-parser.js";
import { z } from "zod";

const ParseIdlSchema = z.object({
  idl_path: z.string().describe("Path to Anchor IDL JSON file"),
});

export type ParseIdlInput = z.infer<typeof ParseIdlSchema>;

export async function parseIdlTool(input: ParseIdlInput): Promise<string> {
  try {
    const idl = parseIdl(input.idl_path);

    const summary = {
      name: idl.name,
      programId: idl.programId,
      instructions: idl.instructions.map((i) => ({
        name: i.name,
        accountCount: i.accounts.length,
        argCount: i.args.length,
      })),
      accountCount: idl.accounts.length,
      typeCount: idl.types.length,
      errorCount: idl.errors.length,
    };

    return JSON.stringify(summary, null, 2);
  } catch (error) {
    throw new Error(
      `Failed to parse IDL: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export { ParseIdlSchema };
