# Deploy Now - Anchor Scaffold MCP

Git initialized. Ready for deployment.

## Step 1: Create GitHub Repo

1. Go to https://github.com/new
2. Create repo: `anchor-scaffold-mcp`
3. Description: "AI code generator for Solana Anchor programs"
4. Make it public
5. Copy repo URL (e.g., `https://github.com/YOUR_USERNAME/anchor-scaffold-mcp`)

## Step 2: Push to GitHub

```bash
cd c:\Users\rajni\OneDrive\Documents\Portfolio\anchor-scaffold-mcp

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/anchor-scaffold-mcp.git
git branch -M main
git push -u origin main
```

After push, your repo is at:
```
https://github.com/YOUR_USERNAME/anchor-scaffold-mcp
```

## Step 3: Publish to npm

```bash
npm login
# Enter your npm credentials

npm publish
```

After publish, your package is at:
```
https://www.npmjs.com/package/anchor-scaffold-mcp
```

**Global install:**
```bash
npm install -g anchor-scaffold-mcp
anchor-scaffold --help
```

## Step 4: Create GitHub Release

```bash
git tag v0.1.0
git push origin v0.1.0
```

Then on GitHub:
1. Go to Releases
2. Click "Draft a new release"
3. Tag: `v0.1.0`
4. Title: "Anchor Scaffold MCP v0.1.0"
5. Description:

```markdown
# Anchor Scaffold MCP v0.1.0

AI-powered code generator for Solana Anchor programs.

## Features

- Parse Anchor IDL files
- Generate TypeScript clients with typed instruction callers
- Generate Rust account structs with constraints
- Generate test suites (Mocha/Chai)
- Generate complete Anchor programs from descriptions

## Support

- Claude (with prompt caching)
- OpenAI (GPT-4o)
- OpenAI-compatible endpoints

## Quick Start

```bash
npm install -g anchor-scaffold-mcp
export SCAFFOLD_API_KEY=sk-ant-xxxxx
anchor-scaffold gen-ts-client --idl target/idl/my_program.json
```

Or use in Claude Code via MCP.

## Links

- [npm Package](https://www.npmjs.com/package/anchor-scaffold-mcp)
- [GitHub](https://github.com/YOUR_USERNAME/anchor-scaffold-mcp)
- [Documentation](https://github.com/YOUR_USERNAME/anchor-scaffold-mcp/blob/main/QUICKSTART.md)
```

6. Publish release

Release URL:
```
https://github.com/YOUR_USERNAME/anchor-scaffold-mcp/releases/tag/v0.1.0
```

## Step 5: Post on Product Hunt (Optional)

1. Go to https://producthunt.com
2. Click "Ship" (top right)
3. Fill in:
   - **Name:** Anchor Scaffold MCP
   - **Tagline:** AI code generator for Solana Anchor programs
   - **Description:** Generate TypeScript clients, Rust structs, tests, and complete programs with AI
   - **Category:** Developer Tools
   - **Thumbnail:** Create 200x200px image with your logo
4. Link to: https://github.com/YOUR_USERNAME/anchor-scaffold-mcp
5. Submit

## Step 6: Share on Twitter/X

```
🚀 Shipped: Anchor Scaffold MCP

Generate production-ready Anchor code in seconds.

✓ TypeScript clients
✓ Rust account structs  
✓ Test suites
✓ Full programs

AI-powered, prompt-cached, multi-backend.

Ship faster. Code less boilerplate.

github.com/YOUR_USERNAME/anchor-scaffold-mcp
npm i -g anchor-scaffold-mcp
```

## Final URLs

After deployment, you'll have:

```
GitHub:  https://github.com/YOUR_USERNAME/anchor-scaffold-mcp
npm:     https://www.npmjs.com/package/anchor-scaffold-mcp
Release: https://github.com/YOUR_USERNAME/anchor-scaffold-mcp/releases/tag/v0.1.0
npm CLI: npm install -g anchor-scaffold-mcp
```

## Verification

```bash
# Test npm package works
npm install -g anchor-scaffold-mcp
anchor-scaffold --help

# Should output:
# Anchor Scaffold CLI - AI code generation for Anchor programs
# ...
```

---

**YOU'RE LIVE.** Share links everywhere.
