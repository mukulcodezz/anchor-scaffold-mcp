import { readFileSync } from "fs";
import { AIProvider } from "../providers/provider.js";
import { sanitizeOutput, formatRust } from "../formatter.js";
import { z } from "zod";

const GenerateProgramSchema = z.object({
  description: z
    .string()
    .describe("Natural language description of the program to generate"),
  program_name: z.string().describe("Name of the Anchor program (snake_case)"),
});

export type GenerateProgramInput = z.infer<typeof GenerateProgramSchema>;

export async function generateProgramTool(
  input: GenerateProgramInput,
  provider: AIProvider
): Promise<string> {
  const fullProgramPrompt = readFileSync(
    new URL("../prompts/full-program.md", import.meta.url),
    "utf-8"
  );

  const userPrompt = `
Generate a complete Anchor program with the following specifications:

Program Name: ${input.program_name}
Description: ${input.description}

Requirements:
1. Create a valid Anchor 0.30+ program
2. Include lib.rs with #[program] module
3. Create #[derive(Accounts)] structs for all instructions
4. Add custom error enum
5. Include state account structs with space calculation
6. Implement all instruction handlers
7. Use PDAs where appropriate
8. Add helpful comments
9. Ensure code compiles
`;

  const generated = await provider.generate(fullProgramPrompt, userPrompt);
  return formatRust(sanitizeOutput(generated));
}

export { GenerateProgramSchema };
