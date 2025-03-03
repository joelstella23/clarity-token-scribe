import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Test book publishing",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall('token-scribe', 'publish-book',
        [
          types.ascii("Test Book"),
          types.ascii("Test Description"),
          types.uint(1000),
          types.uint(10)
        ],
        deployer.address
      )
    ]);

    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);

    const bookDetails = chain.callReadOnlyFn(
      'token-scribe',
      'get-book-details',
      [types.uint(1)],
      deployer.address
    );

    bookDetails.result.expectOk().expectSome();
  }
});

Clarinet.test({
  name: "Test book purchase",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const buyer = accounts.get('wallet_1')!;

    // First publish a book
    let block = chain.mineBlock([
      Tx.contractCall('token-scribe', 'publish-book',
        [
          types.ascii("Test Book"),
          types.ascii("Test Description"),
          types.uint(1000),
          types.uint(10)
        ],
        deployer.address
      )
    ]);

    // Then purchase it
    block = chain.mineBlock([
      Tx.contractCall('token-scribe', 'purchase-book',
        [types.uint(1)],
        buyer.address
      )
    ]);

    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    // Verify ownership transferred
    const owner = chain.callReadOnlyFn(
      'token-scribe',
      'get-owner',
      [types.uint(1)],
      deployer.address
    );

    owner.result.expectOk().expectSome().expectPrincipal(buyer.address);
  }
});
