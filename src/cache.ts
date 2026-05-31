import { createHash } from "crypto";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const CACHE_DIR = join(homedir(), ".anchor-scaffold", "cache");

export interface CacheEntry {
  hash: string;
  result: string;
  timestamp: number;
  ttl: number;
}

export function getCacheKey(
  systemPrompt: string,
  userPrompt: string
): string {
  const combined = `${systemPrompt}|||${userPrompt}`;
  return createHash("sha256").update(combined).digest("hex");
}

export function readCache(key: string): string | null {
  try {
    const path = join(CACHE_DIR, `${key}.json`);
    const data: CacheEntry = JSON.parse(readFileSync(path, "utf-8"));

    const age = Date.now() - data.timestamp;
    if (age > data.ttl) {
      return null;
    }

    return data.result;
  } catch {
    return null;
  }
}

export function writeCache(
  key: string,
  result: string,
  ttlMinutes: number = 1440
): void {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
    const path = join(CACHE_DIR, `${key}.json`);
    const entry: CacheEntry = {
      hash: key,
      result,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    };
    writeFileSync(path, JSON.stringify(entry, null, 2));
  } catch (error) {
    console.error("Cache write failed:", error);
  }
}

export function clearCache(): void {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
    const files = require("fs")
      .readdirSync(CACHE_DIR)
      .filter((f: string) => f.endsWith(".json"));
    for (const file of files) {
      require("fs").unlinkSync(join(CACHE_DIR, file));
    }
  } catch {
    // ignore
  }
}
