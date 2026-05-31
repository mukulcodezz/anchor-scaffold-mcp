# Anchor Scaffold MCP v0.1.1

Security hardening + real prompt caching + test suite.

## 🔒 Security & Correctness

- **Path traversal blocked** — `--output` is now confined to the working directory; `idl_path` is validated before any filesystem access.
- **Input validation wired in** — IDL path, instruction name, program name, and description are validated before any fs or API call (previously `validation.ts` was dead code).
- **ESM cache bug fixed** — `cache.ts` used a dynamic `require("fs")` inside an ES module, which broke `clearCache`. Now uses proper imports.
- **Cache files hardened** — written with `0600` permissions (generated code may be sensitive).
- **Config validation** — clear error when the config file exists but has no `apiKey`.
- **`parse-idl` needs no API key** — it is a pure local operation.

## ⚡ Real Prompt Caching

- Claude provider now actually sends `cache_control: ephemeral` on the system prompt with the prompt-caching beta header. The "~90% cost reduction on repeated IDLs" claim is now backed by code, not just docs.

## 🧪 Quality

- **19 unit tests** (parser, validation, formatter) via `node:test` — zero extra dependencies.
- **GitHub Actions CI** — build + test on Node 18 & 20.
- Provider clients now use a 120s timeout and 2 retries.
- Fixed broken regex in `formatter.ts` `extractCodeBlock` (escaped char classes; language string is regex-escaped).

## Install

```bash
npm install -g anchor-scaffold-mcp
```

Full changelog: [CHANGELOG.md](CHANGELOG.md)
