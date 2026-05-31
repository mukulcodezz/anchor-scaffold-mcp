export interface AIProvider {
  generate(systemPrompt: string, userPrompt: string): Promise<string>;
}

export interface ProviderOptions {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}
