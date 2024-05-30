# solana-pnfts-tests
Testing the PNFTs of Solana

## Setting up
1. Ensure .env is created and SOLANA_RPC_ENDPOINT is populated. You can get a solana rpc endpoint from QuickNode or Alchemy
2. Run `npm run build`
3. To generate your wallet, run `npm run generate-sol-wallet`. - Note if funding the devnet wallet's code has failed, manually add devnet solana by using this [faucet](https://faucet.solana.com/)
4. Adjust Config and Images if necessary
5. Run `npm run generate-nft`. Enjoy!
