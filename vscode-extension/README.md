# Anchor Scaffold MCP — VS Code Extension

AI scaffolding for **Solana Anchor** programs, available directly in VS Code
**agent mode**. This extension registers the
[`anchor-scaffold-mcp`](https://www.npmjs.com/package/anchor-scaffold-mcp)
server as a Model Context Protocol (MCP) provider so the language model can call
its tools.

> **Free.** This extension and the underlying MCP server are open source (MIT).
> You only pay your own AI provider (Claude or OpenAI) for token usage.

## Tools exposed

- **parse_idl** — parse and summarize an Anchor IDL JSON file
- **generate_ts_client** — typed TypeScript client (instruction callers, PDA helpers, account fetchers)
- **generate_rust_accounts** — `#[derive(Accounts)]` struct for an instruction
- **generate_tests** — Mocha/Jest test suite
- **generate_program** — full Anchor program from a natural-language description

## Requirements

- VS Code **1.101** or newer (native MCP support).
- **Node.js 18+** on your PATH — the extension launches the MCP server with `npx`.
- An API key for **Claude** or **OpenAI**.

## Setup

1. Install the extension.
2. Run **Anchor Scaffold: Set API Key** from the Command Palette and paste your key
   (stored securely in VS Code SecretStorage — never written to settings).
3. (Optional) Set the provider/model in **Settings → Anchor Scaffold MCP**.
4. Open the Copilot Chat **Agent** mode. The Anchor Scaffold tools appear in the
   tools picker. Ask, e.g. *"Generate a TypeScript client from target/idl/vault.json"*.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `anchorScaffold.provider` | `claude` | `claude`, `openai`, or `openai-compatible`. |
| `anchorScaffold.model` | _(empty)_ | Model id override. Empty = provider default. |
| `anchorScaffold.baseUrl` | _(empty)_ | Base URL for `openai-compatible` providers. |

## Privacy

Your API key is stored in VS Code SecretStorage and passed to the local MCP
server process via environment variables. Code-generation prompts are sent to
your chosen AI provider. Nothing is sent anywhere else.

## License

MIT
