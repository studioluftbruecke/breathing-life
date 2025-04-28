import { createPublicClient, createWalletClient, custom, getContract, http } from 'viem';
import { luksoTestnet } from 'viem/chains';
import { waitForTransactionReceipt, writeContract } from 'viem/actions';

import { ERC725 } from '@erc725/erc725.js';

import NFTMetadataJSON from './lsp4metadata-files/DSCF0901.json';

// import smart contract ABI
import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
const metadataUrl = 'https://emerald-broad-dolphin-376.mypinata.cloud/ipfs/bafybeicuvbnbu4arkeqkrkem4ku2shk5dndlge3krsjglgztpwmsvzy6ry/DSCF0901.json'

// Assuming Lukso network configuration
// const client = createWalletClient({
//   chain: mainnet, // Replace with Lukso chain configuration
//   transport: custom(window.lukso)
// });
const publicClient = createPublicClient({
  chain: luksoTestnet,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: luksoTestnet,
  transport: custom(window.lukso), // Assumes Universal Profile Browser Extension or similar
});

// const signer = client; // In viem, the client itself handles signing
const lsp8ContractAddress = '0x47ab3d663c2053c9ca3091eb838ee7da2319df01';
const tokenId = '0x0000000000000000000000000000000000000000000000000000000000000001'; // Replace with your tokenId

const lsp8Contract = getContract({
  address: lsp8ContractAddress,
  abi: LSP8IdentifiableDigitalAsset.abi,
  client: publicClient
});

const schema = [
  {
    name: 'LSP4Metadata',
    key: '0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e',
    keyType: 'Singleton',
    valueType: 'bytes',
    valueContent: 'VerifiableURI',
  },
];

const myErc725 = new ERC725(schema);

const encodedData = myErc725.encodeData([
  {
    keyName: 'LSP4Metadata',
    value: {
      json: NFTMetadataJSON,
      url: metadataUrl,
    },
  },
]);

// Extract the encoded metadata value for LSP4Metadata
const metadataValue = encodedData.values[0]; // The encoded VerifiableURI for LSP4Metadata
const lsp4MetadataKey = schema[0].key; // 0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e


// Main function to set metadata for the first token
async function setMetadataForFirstToken() {
  try {
    // Get the first tokenId
    const tokenId = '0x0000000000000000000000000000000000000000000000000000000000000001'
    if (!tokenId) throw new Error('No tokenId found.');

    // Call setDataForTokenId
    const txHash = await writeContract(walletClient, {
      account: walletClient.account!,
      address: lsp8ContractAddress,
      abi: LSP8IdentifiableDigitalAsset.abi,
      functionName: 'setDataForTokenId',
      args: [tokenId, lsp4MetadataKey, metadataValue],
    });

    console.log('Transaction hash:', txHash);

    // Wait for transaction confirmation
    const receipt = await waitForTransactionReceipt(publicClient, {
      hash: txHash,
    });

    console.log('Transaction confirmed:', receipt);
  } catch (error) {
    console.error('Error setting metadata:', error);
  }
}