import { readFileSync } from "fs";
import { parseIdl } from "../parsers/idl-parser.js";
import { AIProvider } from "../providers/provider.js";
import { sanitizeOutput, formatTypeScript } from "../formatter.js";
import { z } from "zod";

const GenerateTsClientSchema = z.object({
  idl_path: z.string().describe("Path to Anchor IDL JSON file"),
  output_path: z.string().optional().describe("Path to write generated client"),
});

export type GenerateTsClientInput = z.infer<typeof GenerateTsClientSchema>;

export async function generateTsClientTool(
  input: GenerateTsClientInput,
  provider: AIProvider
): Promise<string> {
  const idl = parseIdl(input.idl_path);
  const tsClientPrompt = readFileSync(
    new URL("../prompts/ts-client.md", import.meta.url),
    "utf-8"
  );

  const userPrompt = `
Generate a TypeScript client for the following Anchor program:

Program Name: ${idl.name}
Program ID: ${idl.programId}

Instructions:
${idl.instructions
  .map(
    (i) =>
      `- ${i.name}
  Accounts: ${i.accounts.map((a) => a.name).join(", ")}
  Args: ${i.args.map((a) => `${a.name}: ${a.type}`).join(", ")}`
  )
  .join("\n")}

Types:
${idl.types.map((t) => `- ${t.name}`).join("\n")}

Full IDL:
${JSON.stringify(idl, null, 2)}
`;

  const generated = await provider.generate(tsClientPrompt, userPrompt);
  return formatTypeScript(sanitizeOutput(generated));
}

export { GenerateTsClientSchema };
