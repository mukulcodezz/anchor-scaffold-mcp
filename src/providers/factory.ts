import { Config } from "../config.js";
import { AIProvider, ProviderOptions } from "./provider.js";
import { ClaudeProvider } from "./claude.js";
import { OpenAIProvider } from "./openai.js";

export function createProvider(config: Config): AIProvider {
  const options: ProviderOptions = {
    apiKey: config.apiKey,
    model: config.model,
    baseUrl: config.baseUrl,
  };

  switch (config.provider) {
    case "claude":
      return new ClaudeProvider(options);
    case "openai":
    case "openai-compatible":
      return new OpenAIProvider(options);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}
