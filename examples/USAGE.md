# Usage Examples

## Example 1: Parse IDL

```bash
anchor-scaffold parse-idl --idl examples/token_vault.json
```

Output:
```json
{
  "name": "token_vault",
  "programId": "11111111111111111111111111111111",
  "instructions": [
    { "name": "initialize", "accountCount": 4, "argCount": 1 },
    { "name": "deposit", "accountCount": 5, "argCount": 1 },
    { "name": "withdraw", "accountCount": 5, "argCount": 1 }
  ],
  "accountCount": 1,
  "typeCount": 0,
  "errorCount": 3
}
```

## Example 2: Generate TypeScript Client

```bash
anchor-scaffold gen-ts-client --idl examples/token_vault.json
```

Generates:
```typescript
import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export class TokenVaultClient {
  constructor(readonly program: Program) {}

  async initialize(capacity: BN, accounts: IInitialize): Promise<string> {
    return this.program.methods.initialize(capacity).accounts(accounts).rpc();
  }

  async deposit(amount: BN, accounts: IDeposit): Promise<string> {
    return this.program.methods.deposit(amount).accounts(accounts).rpc();
  }

  async withdraw(amount: BN, accounts: IWithdraw): Promise<string> {
    return this.program.methods.withdraw(amount).accounts(accounts).rpc();
  }

  async fetchVault(address: PublicKey): Promise<Vault | null> {
    return this.program.account.vault.fetchNullable(address);
  }

  static deriveVaultPDA(owner: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), owner.toBuffer()],
      PROGRAM_ID
    );
  }
}

export interface IInitialize {
  vault: PublicKey;
  owner: PublicKey;
  systemProgram: PublicKey;
}

export interface IDeposit {
  vault: PublicKey;
  owner: PublicKey;
  userTokenAccount: PublicKey;
  vaultTokenAccount: PublicKey;
  tokenProgram: PublicKey;
}

export type Vault = {
  owner: PublicKey;
  tokenMint: PublicKey;
  balance: BN;
  capacity: BN;
  bump: number;
};
```

## Example 3: Generate Rust Accounts Struct

```bash
anchor-scaffold gen-rust-accounts --idl examples/token_vault.json --instruction initialize
```

Generates:
```rust
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 32 + 8 + 8 + 1)]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub token_mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
}
```

## Example 4: Generate Test Suite

```bash
anchor-scaffold gen-tests --idl examples/token_vault.json
```

Generates:
```typescript
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { expect } from 'chai';

describe('TokenVault', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.TokenVault as Program;

  it('can initialize vault', async () => {
    const [vaultPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .initialize(new anchor.BN(1000))
      .accounts({
        vault: vaultPda,
        owner: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    expect(tx).to.be.a('string');

    const vault = await program.account.vault.fetch(vaultPda);
    expect(vault.capacity.toString()).to.equal('1000');
  });

  it('can deposit', async () => {
    // deposit test...
  });

  it('fails when unauthorized', async () => {
    // error case test...
  });
});
```

## Example 5: Generate Full Program

```bash
anchor-scaffold gen-program \
  --description "A voting system where members can vote on proposals" \
  --program-name voting_system
```

Generates:
```rust
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod voting_system {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let voting = &mut ctx.accounts.voting;
        voting.authority = ctx.accounts.authority.key();
        Ok(())
    }

    pub fn create_proposal(ctx: Context<CreateProposal>, title: String) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        proposal.creator = ctx.accounts.creator.key();
        proposal.title = title;
        proposal.votes = 0;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        proposal.votes += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32)]
    pub voting: Account<'info, Voting>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(init, payer = creator, space = 8 + 32 + 120 + 8)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    pub voter: Signer<'info>,
}

#[account]
pub struct Voting {
    pub authority: Pubkey,
}

#[account]
pub struct Proposal {
    pub creator: Pubkey,
    pub title: String,
    pub votes: u64,
}

#[error_code]
pub enum VotingError {
    #[msg("Unauthorized")]
    Unauthorized,
}
```

## Output Options

All commands support output to file:

```bash
anchor-scaffold gen-ts-client --idl target/idl/my_program.json -o src/client.ts
anchor-scaffold gen-rust-accounts --idl target/idl/my_program.json --instruction initialize -o src/accounts.rs
anchor-scaffold gen-tests --idl target/idl/my_program.json -o tests/generated.ts
anchor-scaffold gen-program --description "..." --program-name my_prog -o src/lib.rs
```

## Integration with Anchor Project

```bash
cd my-anchor-project
anchor build

# Generate client in src/generated
anchor-scaffold gen-ts-client \
  --idl target/idl/my_program.json \
  --output src/generated/client.ts

# Generate tests in tests/
anchor-scaffold gen-tests \
  --idl target/idl/my_program.json \
  --output tests/generated.ts

# Compile and test
npm run build
anchor test
```

## Custom Provider

Use OpenAI instead of Claude:

```bash
SCAFFOLD_PROVIDER=openai \
SCAFFOLD_API_KEY=sk-... \
SCAFFOLD_MODEL=gpt-4o \
anchor-scaffold gen-ts-client --idl examples/token_vault.json
```

Or local endpoint:

```bash
SCAFFOLD_PROVIDER=openai-compatible \
SCAFFOLD_BASE_URL=http://localhost:1234/v1 \
SCAFFOLD_API_KEY=sk-... \
anchor-scaffold gen-ts-client --idl examples/token_vault.json
```
