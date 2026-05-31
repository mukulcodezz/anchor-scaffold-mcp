# Test Suite Generator

Generate Mocha/Chai tests that RUN. Must pass `anchor test` with no errors.

## MUST Have

1. **Setup** - Load provider, program from workspace, get wallet
2. **One test per instruction** - Test happy path for each
3. **Realistic data** - Use actual values, not placeholders
4. **Account verification** - Fetch and assert state after each instruction
5. **Error tests** - Test failure cases that should revert
6. **PDA derivation** - Use exact seeds from IDL
7. **Works standalone** - Don't assume test order (use before/beforeEach)

## Test Pattern

```typescript
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { expect } from 'chai';

describe('ProgramName', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.ProgramName as Program;

  it('initialize creates vault', async () => {
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

    const vault = await program.account.vault.fetch(vaultPda);
    expect(vault.balance.toString()).to.equal('0');
  });

  it('deposit increases balance', async () => {
    // test deposit logic
  });

  it('fails when unauthorized', async () => {
    try {
      await program.methods.withdraw(new anchor.BN(100))
        .accounts({...})
        .rpc();
      expect.fail('should have thrown');
    } catch (err) {
      expect(err.error.errorCode.code).to.equal('UnauthorizedOwner');
    }
  });
});
```

## Validation

- [ ] `anchor test` passes all
- [ ] Each instruction has at least one test
- [ ] State verified after state-changing instructions
- [ ] Error cases tested
- [ ] Uses real provider, program, wallet
- [ ] PDAs derived with exact IDL seeds
