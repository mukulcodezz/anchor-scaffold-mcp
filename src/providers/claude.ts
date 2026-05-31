import Anthropic from "@anthropic-ai/sdk";
import { AIProvider, ProviderOptions } from "./provider.js";

// The system prompt is the stable, reused part of every request (the generator
// template + IDL context). Marking it ephemeral lets Anthropic cache it, so
// repeated generations only pay full input price on the first call.
// cache_control on a system text block works at runtime in SDK 0.24 but is not
// in the published TextBlockParam type yet, hence the local type + cast.
type CacheableTextBlock = {
  type: "text";
  text: string;
  cache_control?: { type: "ephemeral" };
};

export class ClaudeProvider implements AIProvider {
  private client: Anthropic;
  private model: string;

  constructor(options: ProviderOptions) {
    this.client = new Anthropic({
      apiKey: options.apiKey,
      timeout: 120_000,
      maxRetries: 2,
      defaultHeaders: {
        "anthropic-beta": "prompt-caching-2024-07-31",
      },
    });
    this.model = options.model || "claude-sonnet-4-6";
  }

  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    const system: CacheableTextBlock[] = [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ];

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: system as unknown as Anthropic.TextBlockParam[],
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
