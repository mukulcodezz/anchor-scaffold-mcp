# Full Anchor Program Generator

Generate complete Anchor program that COMPILES. Must be ready to `anchor build` without errors.

## MUST Have

1. **Valid Anchor 0.30+ syntax** - declare_id, #[program] module
2. **Every instruction** - implement what description says
3. **Account structs** - #[derive(Accounts)] for each instruction
4. **State account** - #[account] struct with PDA seeds
5. **Space calculation** - correct math for init
6. **Error enum** - #[error_code] with msg attributes
7. **Validation** - require checks for constraints
8. **No comments** - self-documenting code only

## Code Template

```rust
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, capacity: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.owner.key();
        vault.capacity = capacity;
        vault.balance = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, CustomError::InvalidAmount);
        let vault = &mut ctx.accounts.vault;
        require!(vault.balance + amount <= vault.capacity, CustomError::CapacityExceeded);
        vault.balance += amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 8 + 8)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, seeds = [b"vault", owner.key().as_ref()], bump)]
    pub vault: Account<'info, Vault>,
    #[account(address = vault.owner)]
    pub owner: Signer<'info>,
}

#[account]
pub struct Vault {
    pub owner: Pubkey,
    pub balance: u64,
    pub capacity: u64,
}

#[error_code]
pub enum CustomError {
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Deposit would exceed vault capacity")]
    CapacityExceeded,
}
```

## Validation Checklist

- [ ] `anchor build` succeeds
- [ ] All instructions implement requirements
- [ ] PDAs use deterministic seeds
- [ ] Space calc: 8 + (all field byte sizes)
- [ ] require!() checks for constraints
- [ ] Error enum has all failure cases
- [ ] No unused variables
- [ ] Accounts match instruction logic
