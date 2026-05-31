# Anchor Scaffold MCP

AI code generator for Solana Anchor programs. Generates production-ready TypeScript clients, Rust account structs, tests, and complete programs.

**Start here:** [QUICKSTART.md](QUICKSTART.md)

## What It Does

```bash
# TypeScript client (typed instruction callers, PDA helpers, account fetchers)
anchor-scaffold gen-ts-client --idl target/idl/my_program.json

# Rust accounts struct (derive(Accounts), all constraints, space calc)
anchor-scaffold gen-rust-accounts --idl target/idl/my_program.json --instruction initialize

# Test suite (Mocha/Chai, instruction tests, state verification)
anchor-scaffold gen-tests --idl target/idl/my_program.json

# Full program (lib.rs, all instructions, error enum, state accounts)
anchor-scaffold gen-program --description "A multi-sig wallet" --program-name multisig
```

## Installation

```bash
npm install
npm run build
npm start  # MCP server mode
```

or

```bash
npm install -g anchor-scaffold-mcp
anchor-scaffold --help
```

## Configure

```bash
export SCAFFOLD_API_KEY=sk-ant-xxxxx
export SCAFFOLD_PROVIDER=claude  # or openai
```

Or create `~/.anchor-scaffold/config.json`:
```json
{
  "provider": "claude",
  "apiKey": "sk-ant-...",
  "model": "claude-sonnet-4-6"
}
```

## In Claude Code

Add to `.claude/settings.json`:
```json
{
  "mcpServers": {
    "anchor-scaffold": {
      "command": "npx",
      "args": ["anchor-scaffold-mcp"]
    }
  }
}
```

Then ask Claude:
> Generate a TypeScript client for my program at target/idl/my_program.json

## How It Works

1. Parse Anchor IDL (JSON format)
2. Send IDL + prompt to AI (Claude or OpenAI)
3. AI generates code based on IDL structure
4. Return ready-to-use code

Generated code:
- **TypeScript**: imports from `@coral-xyz/anchor`, fully typed
- **Rust**: `anchor build` compatible, all constraints correct
- **Tests**: `anchor test` compatible, instruction verified
- **Programs**: complete, compiling lib.rs

## Validation

- TypeScript output: no TS errors, imports valid
- Rust output: `anchor build` succeeds
- Tests: `anchor test` passes
- Programs: `anchor build` succeeds

## Limitations

- IDL must be valid Anchor format
- Generated code is starter/scaffold (may need customization)
- Complex validation logic added by hand
- Custom business logic written by developer

## Supported

- Anchor 0.30+
- Solana 1.17+
- Node.js 18+

## Cost

Using Claude with prompt caching: ~$0.01-0.05 per generation (90% cheaper on repeated IDLs).

## Deploy

See [DEPLOY.md](DEPLOY.md) for:
- npm publish
- VS Code extension
- Docker/cloud deployment
- Web service wrapper

## License

MIT
