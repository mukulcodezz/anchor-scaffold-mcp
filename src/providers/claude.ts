import Anthropic from "@anthropic-ai/sdk";
import { AIProvider, ProviderOptions } from "./provider.js";

export class ClaudeProvider implements AIProvider {
  private client: Anthropic;
  private model: string;

  constructor(options: ProviderOptions) {
    this.client = new Anthropic({ apiKey: options.apiKey });
    this.model = options.model || "claude-sonnet-4-6";
  }

  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: [
        {
          type: "text" as const,
          text: systemPrompt,
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text" as const,
              text: userPrompt,
            },
          ],
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in response");
    }

    return textContent.text;
  }
}
