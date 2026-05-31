# Changelog

## [0.1.0] - 2024-05-31

### Added
- **parse_idl** - Parse and summarize Anchor IDL JSON files
- **generate_ts_client** - Generate TypeScript clients with typed instruction callers, PDA helpers, account fetchers
- **generate_rust_accounts** - Generate #[derive(Accounts)] structs with constraints and space calculations
- **generate_tests** - Generate Mocha/Chai test suites
- **generate_program** - Generate complete Anchor programs from natural language descriptions

### Features
- MCP server support for Claude Code integration
- CLI tool for standalone usage
- Multiple AI provider support (Claude, OpenAI, OpenAI-compatible)
- Prompt caching for Claude (90% cost reduction on repeated IDLs)
- Output formatting and sanitization
- IDL JSON parsing with validation
- Config file support (~/.anchor-scaffold/config.json)
- Environment variable configuration
- Example IDL (token_vault.json)

### Documentation
- QUICKSTART.md - 1-minute getting started
- DEPLOY.md - Deployment options (npm, Docker, VS Code, web service)
- README.md - Project overview
- CONTRIBUTING.md - Developer guide
- examples/USAGE.md - Detailed usage examples
- examples/token_vault.json - Example IDL

### Project Structure
- MCP server entry point (src/index.ts)
- CLI wrapper (src/cli.ts)
- 5 tool implementations (src/tools/)
- 4 prompt templates (src/prompts/)
- Configuration loader (src/config.ts)
- IDL parser (src/parsers/idl-parser.ts)
- Provider implementations (src/providers/)
- Code formatters (src/formatter.ts)
- Cache layer (src/cache.ts)

### Tested
- TypeScript compilation (no errors)
- NPM dependency resolution
- Build system
- All 5 tools with example IDL

---

## [Unreleased]

### Planned
- Rust source code parser (generate from existing .rs files)
- Batch code generation
- Output file write support in CLI
- Web service wrapper
- VS Code extension
- Performance optimizations
- Additional AI providers (Anthropic, Ollama)
- Instruction-level generation (generate single instruction)
- Account space calculator
- More prompt improvements based on user feedback

---

## Development Notes

### Architecture Decisions
1. **MCP Server** - Chosen for seamless Claude Code integration
2. **CLI Tool** - Added for standalone use cases
3. **Provider Abstraction** - Allows swapping AI backends without code changes
4. **Prompt Caching** - Claude implementation caches IDL context for cost savings
5. **Modular Structure** - Each tool is independent, easy to test and modify

### Known Limitations
1. IDL must be valid Anchor format (JSON)
2. Generated code is scaffold/starter code (may need customization)
3. Complex business logic must be added by developer
4. Solana 1.17+ required
5. Anchor 0.30+ required

### Performance
- Parse IDL: ~200ms (no API call)
- Generate code: ~3-5 seconds (API call + response)
- Cached generation: ~50ms (cache hit)

### Cost
- Claude: ~$0.01-0.05 per generation (prompt caching reduces by 90%)
- OpenAI: ~$0.05-0.10 per generation

---

## Contributors
- Initial implementation: Raj
