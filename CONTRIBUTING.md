# Contributing

## Adding a New Tool

1. Create tool in `src/tools/new-tool.ts`:
```typescript
import { z } from "zod";
import { AIProvider } from "../providers/provider.js";

export const NewToolSchema = z.object({
  idl_path: z.string().describe("Path to IDL file"),
});

export type NewToolInput = z.infer<typeof NewToolSchema>;

export async function newTool(
  input: NewToolInput,
  provider: AIProvider
): Promise<string> {
  // Implementation
  return result;
}
```

2. Create prompt in `src/prompts/new-tool.md`

3. Register in `src/index.ts`:
```typescript
import { newTool, NewToolSchema } from "./tools/new-tool.js";

const tools: Tool[] = [
  // ... existing tools
  {
    name: "new_tool",
    description: "...",
    inputSchema: { /* schema */ },
  },
];

case "new_tool":
  result = await newTool(
    NewToolSchema.parse(args),
    provider
  );
  break;
```

4. Test with example IDL:
```bash
npm run build
anchor-scaffold new-tool --idl examples/token_vault.json
```

## Improving Prompts

Edit `src/prompts/*.md` to improve code generation quality.

Key principles:
- **Concise** - fewer words = fewer tokens = cheaper
- **Specific** - tell AI exactly what to generate
- **Examples** - show desired output patterns
- **Validation** - include checklist of must-haves

Test with:
```bash
SCAFFOLD_API_KEY=sk-... npm run build
anchor-scaffold gen-ts-client --idl examples/token_vault.json
```

## Adding Providers

1. Implement `AIProvider` interface in `src/providers/`:
```typescript
export class NewProvider implements AIProvider {
  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    // Call your API
  }
}
```

2. Update `src/providers/factory.ts`:
```typescript
case "new-provider":
  return new NewProvider(options);
```

3. Update config in `src/config.ts` if needed

4. Test with:
```bash
SCAFFOLD_PROVIDER=new-provider SCAFFOLD_API_KEY=... anchor-scaffold parse-idl --idl examples/token_vault.json
```

## Testing

Run against multiple IDLs:
```bash
# Test with example
anchor-scaffold gen-ts-client --idl examples/token_vault.json > /tmp/client.ts

# Compile TypeScript output
npx tsc --noEmit /tmp/client.ts

# Test with real project
cd ~/my-anchor-project
anchor build
anchor-scaffold gen-ts-client --idl target/idl/my_program.json
```

## Performance Tuning

1. **Reduce prompt size** - remove verbose sections
2. **Use prompt caching** - Claude caches system prompt (IDL context)
3. **Batch operations** - send multiple generations in one call
4. **Cache results** - use existing `src/cache.ts`

## Debugging

```bash
# Verbose CLI output
SCAFFOLD_API_KEY=sk-... node dist/cli.js gen-ts-client --idl examples/token_vault.json --verbose

# Check cached results
ls ~/.anchor-scaffold/cache/

# Clear cache
rm ~/.anchor-scaffold/cache/*

# Test provider directly
node -e "
  const { createProvider } = require('./dist/providers/factory.js');
  const { loadConfig } = require('./dist/config.js');
  const config = loadConfig();
  const provider = createProvider(config);
  provider.generate('test', 'hello').then(console.log);
"
```

## Release Checklist

- [ ] All tools work with example IDL
- [ ] All tools work with real Anchor projects
- [ ] Generated TypeScript compiles
- [ ] Generated Rust `anchor build`s
- [ ] Generated tests `anchor test` passes
- [ ] Error messages are helpful
- [ ] Documentation updated
- [ ] Version bumped in package.json
- [ ] CHANGELOG.md updated

Release:
```bash
npm version patch  # or minor, major
npm publish
git push && git push --tags
```
