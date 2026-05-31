import { readFileSync } from "fs";
import { parseIdl } from "../parsers/idl-parser.js";
import { AIProvider } from "../providers/provider.js";
import { readCache, writeCache, getCacheKey } from "../cache.js";

export interface ToolContext {
  provider: AIProvider;
  useCache: boolean;
  cacheTtlMinutes?: number;
}

export async function generateWithCache(
  systemPrompt: string,
  userPrompt: string,
  context: ToolContext
): Promise<string> {
  const cacheKey = getCacheKey(systemPrompt, userPrompt);

  if (context.useCache) {
    const cached = readCache(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const result = await context.provider.generate(systemPrompt, userPrompt);

  if (context.useCache) {
    writeCache(cacheKey, result, context.cacheTtlMinutes || 1440);
  }

  return result;
}

export async function loadPrompt(name: string): Promise<string> {
  return readFileSync(
    new URL(`../prompts/${name}.md`, import.meta.url),
    "utf-8"
  );
}

export function buildIdlContext(idlPath: string): string {
  const idl = parseIdl(idlPath);

  return `
Program: ${idl.name}
ID: ${idl.programId}

Instructions (${idl.instructions.length}):
${idl.instructions
  .map(
    (i) =>
      `- ${i.name}: ${i.accounts.length} accounts, ${i.args.length} args`
  )
  .join("\n")}

Accounts (${idl.accounts.length}):
${idl.accounts.map((a) => `- ${a.name}`).join("\n")}

Errors (${idl.errors.length}):
${idl.errors.map((e) => `- ${e.name} (${e.code}): ${e.msg}`).join("\n")}

Full IDL:
${JSON.stringify(idl, null, 2)}
`;
}
