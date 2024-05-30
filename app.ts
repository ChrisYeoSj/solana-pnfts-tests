import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity, irysStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import secret from './secret.json';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/../.env' });

const endpoint: string = process.env.SOLANA_RPC_ENDPOINT ?? '';

if (typeof endpoint === 'string' && endpoint.trim().length === 0) {
}

const solConnection = new Connection(endpoint);

const wallet = Keypair.fromSecretKey(new Uint8Array(secret));
const metaplex = Metaplex.make(solConnection)
    .use(keypairIdentity(wallet))
    .use(irysStorage({
        address: 'https://devnet.irys.xyz',
        providerUrl: endpoint,
        timeout: 60000,
    }));


const nftConfig = {
    imgName: 'TestSolNft',
    symbol: 'TSN',
    sellerFeeBasisPoints: 1000,//500 bp = 5%
    creators: [ // sole creator
        { address: wallet.publicKey, share: 100 },
    ],
    metadata: 'https://arweave.net/xBR5MNsNuC8AN6gNH6iBphFFy_PT_x-TCufts-amAPk'
};


async function mintProgrammableNft(
    metadataUri: string,
    name: string,
    sellerFee: number,
    symbol: string,
    creators: { address: PublicKey, share: number }[]
) {
    console.log(`Minting pNFT`);
    try {
        const transactionBuilder = await metaplex
            .nfts()
            .builders()
            .create({
                uri: metadataUri,
                name: name,
                sellerFeeBasisPoints: sellerFee,
                symbol: symbol,
                creators: creators,
                isMutable: true,
                isCollection: false,
                tokenStandard: TokenStandard.ProgrammableNonFungible,
                ruleSet: null // Metaplex default community-maintained ruleset
            });

        let { signature, confirmResponse } = await metaplex.rpc().sendAndConfirmTransaction(transactionBuilder);
        if (confirmResponse.value.err) {
            throw new Error('failed to confirm transaction');
        }
        const { mintAddress } = transactionBuilder.getContext();
        console.log(`   Success!🎉`);
        console.log(`   Minted NFT: https://explorer.solana.com/address/${mintAddress.toString()}?cluster=devnet`);
        console.log(`   Tx: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    }
    catch (err) {
        console.log(err);
    }
}

mintProgrammableNft(
    nftConfig.metadata,
    nftConfig.imgName,
    nftConfig.sellerFeeBasisPoints,
    nftConfig.symbol,
    nftConfig.creators
);

