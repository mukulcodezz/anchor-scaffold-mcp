# Deployment Guide

## Ship as npm Package

### 1. Publish to npm

```bash
npm login
npm publish
```

Your CLI becomes available globally:
```bash
npm install -g anchor-scaffold-mcp
anchor-scaffold gen-ts-client --idl target/idl/my_program.json
```

### 2. Register as Claude Code MCP Server

Users add to `.claude/settings.json`:
```json
{
  "mcpServers": {
    "anchor-scaffold": {
      "command": "npx",
      "args": ["anchor-scaffold-mcp"],
      "env": {
        "SCAFFOLD_PROVIDER": "claude",
        "SCAFFOLD_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

Then in Claude Code:
```
Generate a TypeScript client for target/idl/my_program.json
Generate tests for target/idl/my_program.json
Generate an Anchor program named "token_vault" that stores SOL
```

### 3. Register as VS Code Extension

Create `package.json` extensions entry:
```json
{
  "contributes": {
    "commands": [
      {
        "command": "anchor-scaffold.generateClient",
        "title": "Anchor: Generate TypeScript Client"
      }
    ]
  }
}
```

Publish to VS Code Marketplace.

## Ship as Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t anchor-scaffold .
docker run -e SCAFFOLD_API_KEY=sk-ant-... anchor-scaffold
```

## Ship as Web Service

Add Express wrapper:

```typescript
import express from 'express';
const app = express();

app.post('/gen-ts-client', async (req, res) => {
  const { idlPath } = req.body;
  const result = await generateTsClientTool({ idl_path: idlPath }, provider);
  res.json({ code: result });
});

app.listen(3000);
```

Deploy to Vercel/Railway/Heroku.

## Testing Before Ship

```bash
# Test CLI
SCAFFOLD_API_KEY=sk-ant-... anchor-scaffold gen-ts-client --idl examples/token_vault.json

# Test MCP
node dist/index.js

# Test with real IDL (from Anchor project)
anchor-scaffold parse-idl --idl ../../my-anchor-project/target/idl/my_program.json
```

## Checklist

- [ ] All 5 tools work with example IDL
- [ ] CLI generates valid TypeScript that compiles
- [ ] CLI generates valid Rust that `anchor build`s
- [ ] Generated tests run with `anchor test`
- [ ] Error messages are helpful
- [ ] Documentation complete
- [ ] Example IDL included
- [ ] Config documentation clear
- [ ] API key validation works
- [ ] Ready for production use

## Post-Launch

Monitor:
- API rate limits (Claude: 10k/min, OpenAI: varies)
- Cache hit rate (should be >60% for repeated IDLs)
- User feedback on generated code quality
- Error patterns in logs
