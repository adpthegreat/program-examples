import * as anchor from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { BankrunProvider } from 'anchor-bankrun';
import { assert } from 'chai';
import { startAnchor } from 'solana-bankrun';
import type { CounterProgram } from '../target/types/counter_program';

const IDL = require('../target/idl/counter_program.json');
const PROGRAM_ID = new PublicKey(IDL.address);

describe('counter_program', async () => {
  // Configure the client to use the anchor-bankrun
  const context = await startAnchor('', [{ name: 'counter_program', programId: PROGRAM_ID }], []);

  const provider = new BankrunProvider(context);

  const payer = provider.wallet as anchor.Wallet;

  const program = new anchor.Program<CounterProgram>(IDL, provider);

  // Generate a new keypair for the counter account
  const counterKeypair = new Keypair();

  it('Initialize Counter', async () => {
    await program.methods
      .initializeCounter()
      .accounts({
        counter: counterKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([counterKeypair])
      .rpc();

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey);

    assert(currentCount.count.toNumber() === 0, 'Expected initialized count to be 0');
  });

  it('Increment Counter', async () => {
    await program.methods.increment().accounts({ counter: counterKeypair.publicKey }).rpc();

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey);

    assert(currentCount.count.toNumber() === 1, 'Expected  count to be 1');
  });

  it('Increment Counter Again', async () => {
    await program.methods.increment().accounts({ counter: counterKeypair.publicKey }).rpc();

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey);

    assert(currentCount.count.toNumber() === 2, 'Expected  count to be 2');
  });
});
