# Quickstart

## 1-Minute Setup

```bash
# Set API key
export SCAFFOLD_API_KEY=sk-ant-xxxxx

# Test with example IDL
anchor-scaffold parse-idl --idl examples/token_vault.json

# Generate TypeScript client
anchor-scaffold gen-ts-client --idl examples/token_vault.json

# Generate Rust accounts struct
anchor-scaffold gen-rust-accounts --idl examples/token_vault.json --instruction initialize

# Generate test suite
anchor-scaffold gen-tests --idl examples/token_vault.json

# Generate full program
anchor-scaffold gen-program --description "A vault that holds SOL" --program-name sol_vault
```

## Use Your Own IDL

```bash
cd my-anchor-project
anchor build
anchor-scaffold gen-ts-client --idl target/idl/my_program.json -o src/generated/client.ts
```

## In Claude Code

Add to `.claude/settings.json`:
```json
{
  "mcpServers": {
    "anchor-scaffold": {
      "command": "npx",
      "args": ["anchor-scaffold-mcp"],
      "env": {
        "SCAFFOLD_API_KEY": "sk-ant-your-key-here"
      }
    }
  }
}
```

Then ask Claude:
> Generate a TypeScript client for my Anchor program at target/idl/my_program.json

> Generate tests for target/idl/my_program.json

> Generate an Anchor program for a "multi-sig wallet that supports custom executors"

## What Gets Generated

### TypeScript Client
- Typed instruction callers
- PDA derivation helpers
- Account fetchers
- Event listeners
- Ready to import and use

### Rust Accounts
- `#[derive(Accounts)]` structs
- All constraints from IDL
- Correct space calculation
- Inline documentation

### Tests
- Mocha/Chai test suite
- One test per instruction
- Account verification
- Error case handling
- Ready to `anchor test`

### Full Programs
- Complete lib.rs
- All instruction handlers
- State accounts with PDAs
- Custom error enum
- Ready to `anchor build`

## Configuration

### Environment Variable
```bash
export SCAFFOLD_API_KEY=sk-ant-xxxxx
export SCAFFOLD_PROVIDER=claude  # or openai
export SCAFFOLD_MODEL=claude-sonnet-4-6
```

### Config File
Create `~/.anchor-scaffold/config.json`:
```json
{
  "provider": "claude",
  "apiKey": "sk-ant-xxxxx",
  "model": "claude-sonnet-4-6"
}
```

## Troubleshooting

**Error: `SCAFFOLD_API_KEY not set`**
- Set `SCAFFOLD_API_KEY` env var with your API key
- Or create `~/.anchor-scaffold/config.json`

**Error: `IDL file not found`**
- Check path exists: `ls target/idl/my_program.json`
- Use absolute paths: `/full/path/to/idl.json`

**Generated code won't compile**
- Check IDL is valid Anchor format
- Verify account names match IDL exactly
- Run `anchor build` to see specific errors

**Generated tests fail**
- Ensure IDL instruction args are correct
- Verify account types match program
- Check PDA seeds match implementation

## Next Steps

1. Generate client for your program
2. Copy generated code into your project
3. Add types to your package
4. Import and use the client
5. Submit feedback: https://github.com/your-repo/issues
