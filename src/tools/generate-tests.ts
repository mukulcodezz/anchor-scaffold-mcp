import { readFileSync } from "fs";
import { parseIdl } from "../parsers/idl-parser.js";
import { AIProvider } from "../providers/provider.js";
import { sanitizeOutput, formatTypeScript } from "../formatter.js";
import { z } from "zod";

const GenerateTestsSchema = z.object({
  idl_path: z.string().describe("Path to Anchor IDL JSON file"),
  test_framework: z
    .enum(["mocha", "jest"])
    .optional()
    .describe("Test framework to use (default: mocha)"),
});

export type GenerateTestsInput = z.infer<typeof GenerateTestsSchema>;

export async function generateTestsTool(
  input: GenerateTestsInput,
  provider: AIProvider
): Promise<string> {
  const idl = parseIdl(input.idl_path);
  const testsPrompt = readFileSync(
    new URL("../prompts/tests.md", import.meta.url),
    "utf-8"
  );

  const userPrompt = `
Generate a comprehensive test suite for the ${idl.name} program using ${input.test_framework || "mocha"}.

Instructions to test:
${idl.instructions
  .map(
    (i) =>
      `- ${i.name}(${i.args.map((a) => a.name).join(", ")})
  Accounts: ${i.accounts.map((a) => a.name).join(", ")}`
  )
  .join("\n")}

Account types:
${idl.accounts.map((a) => `- ${a.name}`).join("\n")}

Custom errors:
${idl.errors.map((e) => `- ${e.name} (code: ${e.code}): ${e.msg}`).join("\n")}

Full IDL:
${JSON.stringify(idl, null, 2)}
`;

  const generated = await provider.generate(testsPrompt, userPrompt);
  return formatTypeScript(sanitizeOutput(generated));
}

export { GenerateTestsSchema };
