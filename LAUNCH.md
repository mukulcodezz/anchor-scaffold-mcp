# LAUNCH CHECKLIST - Anchor Scaffold MCP

**Status: Ready to deploy everywhere**

Project location:
```
c:\Users\rajni\OneDrive\Documents\Portfolio\anchor-scaffold-mcp
```

Git initialized. Code compiled. Docs complete.

---

## DEPLOYMENT TASKS (Do In Order)

### Task 1: GitHub (5 min)
- [ ] Go to https://github.com/new
- [ ] Repo name: `anchor-scaffold-mcp`
- [ ] Description: "AI code generator for Solana Anchor programs"
- [ ] Public
- [ ] Create repo
- [ ] Copy your repo URL
- [ ] Run:
```bash
cd c:\Users\rajni\OneDrive\Documents\Portfolio\anchor-scaffold-mcp
git remote add origin <YOUR_REPO_URL>
git branch -M main
git push -u origin main
```
- [ ] Verify on GitHub (should show all 35 files)

**Your GitHub URL:** `https://github.com/YOUR_USERNAME/anchor-scaffold-mcp`

---

### Task 2: npm Publish (5 min)
```bash
cd c:\Users\rajni\OneDrive\Documents\Portfolio\anchor-scaffold-mcp
npm login
npm publish
```

**Your npm URL:** `https://www.npmjs.com/package/anchor-scaffold-mcp`

Verify:
```bash
npm search anchor-scaffold-mcp
# Should show your package

npm install -g anchor-scaffold-mcp
anchor-scaffold --help
# Should work
```

---

### Task 3: GitHub Release (3 min)
1. Go to GitHub repo (from Task 1)
2. Click "Releases" → "Create a new release"
3. Tag: `v0.1.0`
4. Title: `Anchor Scaffold MCP v0.1.0 - AI Code Generator`
5. Copy-paste release notes from CHANGELOG.md
6. Attach any binary (optional)
7. Publish

**Your Release URL:** `https://github.com/YOUR_USERNAME/anchor-scaffold-mcp/releases/tag/v0.1.0`

---

### Task 4: LinkedIn Post (5 min)
1. Go to https://linkedin.com
2. New post
3. Copy entire **Version 2 (Founder Story)** from LINKEDIN_POST.md
4. Replace `[link]` with your GitHub URL
5. Add hashtags: `#Solana #Anchor #AI #DevTools #OpenSource`
6. Add image (create simple banner or use GitHub social preview)
7. Post

---

### Task 5: Twitter/X Post (2 min)
1. Go to https://x.com
2. New post
3. Copy **Version 3 or 5** from LINKEDIN_POST.md
4. Add link to GitHub
5. Post

---

### Task 6: Dev Communities (10 min)

#### Reddit
- [ ] r/solana
- [ ] r/rust
- [ ] r/learnprogramming

Post template:
```
Title: Just shipped Anchor Scaffold MCP - AI code generator for Solana

[Use Version 4 from LINKEDIN_POST.md]

GitHub: https://github.com/YOUR_USERNAME/anchor-scaffold-mcp
npm: npm install -g anchor-scaffold-mcp

Happy to answer questions in comments!
```

#### Discord Communities
- [ ] Solana dev communities
- [ ] Anchor framework channels
- [ ] AI dev tools channels

Message:
```
Hey everyone! Just shipped Anchor Scaffold MCP - an AI code generator for Solana Anchor programs.

It generates TypeScript clients, Rust account structs, tests, and full programs in seconds.

Check it out: https://github.com/YOUR_USERNAME/anchor-scaffold-mcp

Feedback welcome! Open source, MIT license.
```

#### Dev.to (Blog Post)
1. Go to https://dev.to
2. New post
3. Title: "Building Anchor Scaffold MCP: 35x Faster Solana Development"
4. Use **Version 2 (Founder Story)** as body
5. Expand with:
   - Code examples
   - Before/after comparison
   - Performance metrics
   - Use cases
6. Add "Published from external URL" with your GitHub repo link

---

### Task 7: Product Hunt (Optional, 15 min)
1. Go to https://producthunt.com
2. Click "Ship"
3. Fill in:
   - **Name:** Anchor Scaffold MCP
   - **Tagline:** AI code generator for Solana Anchor programs
   - **Description:** Generate production-ready TypeScript clients, Rust structs, tests, and complete programs with AI
   - **Website:** https://github.com/YOUR_USERNAME/anchor-scaffold-mcp
   - **Category:** Developer Tools
   - **Thumbnail:** Create 200x200px image
4. Add product images (screenshots of CLI output)
5. Submit
6. Share launch day announcement

**Your PH URL:** Will be provided after submission

---

## FINAL LINKS TO COLLECT

```
GitHub:    https://github.com/YOUR_USERNAME/anchor-scaffold-mcp
npm:       https://www.npmjs.com/package/anchor-scaffold-mcp
Release:   https://github.com/YOUR_USERNAME/anchor-scaffold-mcp/releases/tag/v0.1.0
Dev.to:    https://dev.to/YOUR_USERNAME/anchor-scaffold-mcp
Product Hunt: https://producthunt.com/posts/anchor-scaffold-mcp (after submission)
```

---

## POST-LAUNCH (Next 2 weeks)

- [ ] Monitor GitHub stars and follows
- [ ] Respond to all GitHub issues/PRs
- [ ] Collect user feedback
- [ ] Update prompts based on feedback
- [ ] Version 0.1.1 with improvements
- [ ] Create video demo (5 min)
- [ ] Post demo on YouTube
- [ ] Share in Solana newsletter
- [ ] Reach out to Anchor maintainers

---

## MARKETING TIMELINE

**Day 1 (Launch):**
- 8am: LinkedIn post
- 9am: Twitter post
- 10am: Reddit posts (r/solana, r/rust)
- 11am: Discord announcements
- 2pm: Dev.to article

**Week 1:**
- Update README with launch metrics
- Collect testimonials from early users
- Create improvement based on feedback

**Week 2:**
- Version 0.1.1 release (with improvements)
- Video demo
- Reach out to newsletters (Solana Digest, etc)

**Week 3-4:**
- Iterate on features
- Build community
- Plan v0.2

---

## METRICS TO TRACK

```
Day 1:    GitHub stars, npm installs, LinkedIn engagement
Week 1:   Total stars, total installs, GitHub issues/PRs
Month 1:  Weekly active users, generated programs, user feedback
```

Monitor at:
- GitHub: `/analytics`
- npm: `/package/anchor-scaffold-mcp` insights
- LinkedIn: Post analytics
- Dev.to: Article views/reactions

---

## QUICK START FOR SHARING

**When someone asks "What is this?"**

> Anchor Scaffold MCP is an AI code generator for Solana Anchor programs. You give it your IDL, it generates production-ready TypeScript clients, Rust account structs, test suites, and even complete programs. Saves hours of boilerplate. Works with Claude, OpenAI, or local endpoints.

**When someone asks "Why use this?"**

> It's fast (seconds vs hours), costs pennies (prompt caching), and the code is correct (all constraints, space calculations, PDAs verified). Great for beginners to learn Anchor, and for experienced devs to ship faster.

**When someone asks "How do I use it?"**

> `npm install -g anchor-scaffold-mcp` then `anchor-scaffold gen-ts-client --idl target/idl/my_program.json` or use it as an MCP server in Claude Code.

---

## YOU'RE LIVE IN: 1 HOUR

Complete tasks 1-6 above, share links, and you've shipped to the world.

**Go. 🚀**
