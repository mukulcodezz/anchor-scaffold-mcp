# Rust Accounts Struct Generator

Generate CORRECT `#[derive(Accounts)]` struct. Syntax must be exact and compile without errors.

## MUST Have

1. **Correct types** - Account<'info, T>, Signer<'info>, Program<'info, T>
2. **All accounts** - Every account from IDL in struct
3. **Correct constraints** - Match IDL exactly. If IDL says PDA, add seeds+bump
4. **Space calc** - 8 (discriminator) + all field sizes. Verify math.
5. **system_program** - ALWAYS include for `init`
6. **Lifetimes** - All generic params need 'info
7. **No comments** - Only if constraint is non-obvious

## Constraint Rules

- `mut` = account state changes
- `init` = create account (needs payer, space, system_program)
- `seeds = [b"const", account_field.key().as_ref()]` = PDA (order matters!)
- `bump` = PDA bump seed (auto-calculated)
- `has_one = field_name` = relationship check
- `signer` = transaction must sign (use Signer type)
- `owner = program_id` = check account owner is this program

## Space Math

8 + Pubkey*32 + u64*8 + u32*4 + bool*1 + (Vec: 4+4 + items) + (String: 4+4 + bytes)

## Code Shape

```rust
#[derive(Accounts)]
pub struct NameInstruction<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(init, payer = authority, space = 8 + 32 + 8 + 1)]
    pub state: Account<'info, StateAccount>,
    
    #[account(seeds = [b"vault", authority.key().as_ref()], bump)]
    pub vault: Account<'info, VaultAccount>,
    
    pub system_program: Program<'info, System>,
}
```

## Validation Checklist

- [ ] Compiles with `anchor build`
- [ ] Every account field has Solana type (Account, Signer, Program, AccountInfo)
- [ ] PDA seeds match IDL seed order exactly
- [ ] Space calc correct (use https://book.anchor-lang.com for reference)
- [ ] system_program present if any `init`
- [ ] Signer for accounts that must sign
