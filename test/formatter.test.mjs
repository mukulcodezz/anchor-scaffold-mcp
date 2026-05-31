import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatTypeScript,
  formatRust,
  sanitizeOutput,
  extractCodeBlock,
} from "../dist/formatter.js";

test("formatTypeScript strips ts fences", () => {
  assert.equal(formatTypeScript("```typescript\nconst x = 1;\n```"), "const x = 1;");
});

test("formatRust strips rust fences", () => {
  assert.equal(formatRust("```rust\nfn main() {}\n```"), "fn main() {}");
});

test("sanitizeOutput removes leading prose", () => {
  const out = sanitizeOutput("Here is the code:\nconst x = 1;");
  assert.ok(!out.startsWith("Here"));
});

test("extractCodeBlock pulls fenced content", () => {
  const out = extractCodeBlock("intro\n```ts\nconst x = 1;\n```\noutro", "ts");
  assert.equal(out.trim(), "const x = 1;");
});

test("extractCodeBlock does not throw on regex-special language", () => {
  assert.doesNotThrow(() => extractCodeBlock("```c++\nx\n```", "c++"));
});
