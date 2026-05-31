# TypeScript Client Generator

Generate production-ready TypeScript client for Anchor program. Must be ready to import and use immediately.

## CRITICAL Requirements

1. **Imports** - Use `@coral-xyz/anchor`, `@solana/web3.js`. NO external deps beyond these.
2. **Every instruction** - Create method for EACH instruction with typed args
3. **PDA helpers** - static methods for each PDA in IDL with seed calculation
4. **Account fetchers** - fetch each account type with proper deserialization
5. **Types** - full TypeScript interfaces for all IDL types. Export them.
6. **Error handling** - wrap calls in try-catch, throw readable errors
7. **No comments** - code is self-documenting. Only complex logic gets brief comments.
8. **Export all** - export class, types, helper functions, constants

## Code Pattern

```typescript
import { Program } from '@coral-xyz/anchor';
import { PublicKey, TransactionSignature } from '@solana/web3.js';

export class Client {
  constructor(readonly program: Program) {}
  
  async instructionName(args: IArgs, accounts: IAccounts): Promise<TransactionSignature> {
    return this.program.methods.instructionName(args).accounts(accounts).rpc();
  }
  
  async fetchAccount(address: PublicKey): Promise<AccountType | null> {
    return this.program.account.accountName.fetchNullable(address);
  }
  
  static derivePDA(seed: string, owner: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync([Buffer.from(seed), owner.toBuffer()], programId);
  }
}

export interface IArgs { ... }
export interface IAccounts { ... }
export type AccountType = { ... }
```

## Validation

- Compile: no TS errors
- Imports: all exist in @coral-xyz/anchor or @solana/web3.js
- Methods: one per instruction, matches IDL exactly
- PDA seeds: match IDL seed order exactly
- Types: all exported, match account structs
