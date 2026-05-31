import OpenAI from "openai";
import { AIProvider, ProviderOptions } from "./provider.js";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(options: ProviderOptions) {
    this.client = new OpenAI({
      apiKey: options.apiKey,
      baseURL: options.baseUrl,
    });
    this.model = options.model || "gpt-4o";
  }

  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    const message = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const textContent = message.choices[0]?.message?.content;
    if (!textContent) {
      throw new Error("No text content in response");
    }

    return textContent;
  }
}
