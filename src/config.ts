import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export interface Config {
  provider: "claude" | "openai" | "openai-compatible";
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

export function loadConfig(): Config {
  const configFile = join(homedir(), ".anchor-scaffold", "config.json");

  const provider = process.env.SCAFFOLD_PROVIDER || "claude";
  const apiKey = process.env.SCAFFOLD_API_KEY;
  const model = process.env.SCAFFOLD_MODEL;
  const baseUrl = process.env.SCAFFOLD_BASE_URL;

  if (!apiKey) {
    let fileConfig: Partial<Config>;
    try {
      fileConfig = JSON.parse(readFileSync(configFile, "utf-8"));
    } catch {
      throw new Error(
        "SCAFFOLD_API_KEY not set. Set via env var or ~/.anchor-scaffold/config.json"
      );
    }

    if (!fileConfig.apiKey) {
      throw new Error(
        `apiKey missing in ${configFile}. Add an "apiKey" field or set SCAFFOLD_API_KEY.`
      );
    }

    const fileProvider = (fileConfig.provider || provider) as Config["provider"];
    return {
      provider: fileProvider,
      apiKey: fileConfig.apiKey,
      model: fileConfig.model || model || getDefaultModel(fileProvider),
      baseUrl: fileConfig.baseUrl || baseUrl,
    };
  }

  return {
    provider: provider as "claude" | "openai" | "openai-compatible",
    apiKey,
    model: model || getDefaultModel(provider),
    baseUrl,
  };
}

function getDefaultModel(provider: string): string {
  switch (provider) {
    case "claude":
      return "claude-sonnet-4-6";
    case "openai":
      return "gpt-4o";
    case "openai-compatible":
      return "gpt-4";
    default:
      return "claude-sonnet-4-6";
  }
}
