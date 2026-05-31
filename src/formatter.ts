export function formatTypeScript(code: string): string {
  return code
    .replace(/```typescript\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
}

export function formatRust(code: string): string {
  return code
    .replace(/```rust\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
}

export function extractCodeBlock(text: string, language?: string): string {
  const lang = language ? escapeRegExp(language) : "";
  const patterns = [
    new RegExp("```" + lang + "\\n([\\s\\S]*?)\\n```"),
    new RegExp("```[a-z]*\\n([\\s\\S]*?)\\n```"),
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match) {
      return match[1] ?? match[0];
    }
  }

  return text;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function sanitizeOutput(code: string): string {
  // Remove markdown code blocks
  code = code.replace(/```[a-z]*\n?/g, "");

  // Remove common prefixes from AI responses
  code = code.replace(/^Here.+?:\n/i, "");
  code = code.replace(/^This\s+\w+\s+will.+?:\n/i, "");

  // Remove trailing notes
  code = code.replace(/\n\n(Note:|Note|Important:|Let me|Feel free|If|You may).*/i, "");

  return code.trim();
}

export function wrapCode(code: string, language: string): string {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

export function summary(code: string, maxLines: number = 10): string {
  const lines = code.split("\n");
  return lines.slice(0, maxLines).join("\n") + (lines.length > maxLines ? "\n..." : "");
}
