import { readFileSync } from "fs";
import { parseIdl } from "../parsers/idl-parser.js";
import { AIProvider } from "../providers/provider.js";
import { sanitizeOutput, formatRust } from "../formatter.js";
import { z } from "zod";

const GenerateRustAccountsSchema = z.object({
  idl_path: z.string().describe("Path to Anchor IDL JSON file"),
  instruction_name: z.string().describe("Name of the instruction to generate accounts for"),
});

export type GenerateRustAccountsInput = z.infer<typeof GenerateRustAccountsSchema>;

export async function generateRustAccountsTool(
  input: GenerateRustAccountsInput,
  provider: AIProvider
): Promise<string> {
  const idl = parseIdl(input.idl_path);
  const rustAccountsPrompt = readFileSync(
    new URL("../prompts/rust-accounts.md", import.meta.url),
    "utf-8"
  );

  const instruction = idl.instructions.find((i) => i.name === input.instruction_name);
  if (!instruction) {
    throw new Error(`Instruction ${input.instruction_name} not found in IDL`);
  }

  const userPrompt = `
Generate a #[derive(Accounts)] struct for the "${input.instruction_name}" instruction in the ${idl.name} program.

Accounts needed:
${instruction.accounts
  .map(
    (a) =>
      `- ${a.name} (mutable: ${a.isMut}, signer: ${a.isSigner})
  ${a.pda ? `PDA with seeds: ${a.pda.seeds.map((s) => s.kind).join(", ")}` : ""}`
  )
  .join("\n")}

Instruction arguments:
${instruction.args.map((a) => `- ${a.name}: ${a.type}`).join("\n")}

Related account types:
${idl.accounts.map((t) => `- ${t.name}`).join("\n")}

Full IDL:
${JSON.stringify(idl, null, 2)}
`;

  const generated = await provider.generate(rustAccountsPrompt, userPrompt);
  return formatRust(sanitizeOutput(generated));
}

export { GenerateRustAccountsSchema };
