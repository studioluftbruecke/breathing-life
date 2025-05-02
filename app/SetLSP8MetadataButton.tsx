'use client';

// import { readFileSync } from "fs";
import { Button } from './lib/components/ui/button';
import { useState } from 'react';

import { createPublicClient, createWalletClient, custom, getContract, http } from 'viem';
import { luksoTestnet } from 'viem/chains';
import { simulateContract, waitForTransactionReceipt, writeContract } from 'viem/actions';

import NFTMetadataJSON from '../scripts/lsp4metadata-files/DSCF0901.json';
// import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import { lsp8IdentifiableDigitalAssetAbi } from '@lukso/lsp-smart-contracts/abi';

const metadataUrl = 'https://emerald-broad-dolphin-376.mypinata.cloud/ipfs/bafybeicuvbnbu4arkeqkrkem4ku2shk5dndlge3krsjglgztpwmsvzy6ry/DSCF0901.json';
const lsp8ContractAddress = process.env.NEXT_PUBLIC_COLLECTION_ADDRESS;

import { ERC725 } from "@erc725/erc725.js";
import LSP4DigitalAssetSchema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";

const erc725 = new ERC725(LSP4DigitalAssetSchema);

// Lukso network configuration
const publicClient = createPublicClient({
  chain: luksoTestnet,
  transport: http('https://rpc.testnet.lukso.network'),
});

const walletClient = createWalletClient({
  chain: luksoTestnet,
  // @ts-ignore
  transport: custom(window.lukso), // Universal Profile Browser Extension
});

export default function SetLSP8MetadataButton(props: {
  tokenId: `0x${string}`;
  collectionOwner: string;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  


  // Function to verify tokenId
  // async function verifyTokenId(tokenId: string) {
  //   try {
  //     const tokenOwner = await lsp8Contract.read.ownerOf([tokenId]);
  //     console.log('Token owner:', tokenOwner);
  //     return tokenOwner;
  //   } catch (error) {
  //     console.error('Error verifying tokenId:', error);
  //     throw new Error(`Token ID ${tokenId} does not exist.`);
  //   }
  // }

  // Main function to set metadata
  async function setMetadataForFirstToken() {
    setErrorMessage(null);
    setTxHash(null);

    if (!lsp8ContractAddress) {
      console.error('No contract address found');
      return
    }


    const lsp8Contract = getContract({
      address: lsp8ContractAddress as `0x${string}`,
      abi: lsp8IdentifiableDigitalAssetAbi,
      client: { public: publicClient, wallet: walletClient },
    });
  
    // const schema = [
    //   {
    //     name: 'LSP4Metadata',
    //     key: '0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e',
    //     keyType: 'Singleton',
    //     valueType: 'bytes',
    //     valueContent: 'VerifiableURI',
    //   },
    // ];
  
    // const myErc725 = new ERC725(schema);
  
    // const encodedData = myErc725.encodeData([
    //   {
    //     keyName: 'LSP4Metadata',
    //     value: {
    //       json: NFTMetadataJSON,
    //       url: metadataUrl,
    //     },
    //   },
    // ]);
  
    const url =
      "ipfs://bafybeicuvbnbu4arkeqkrkem4ku2shk5dndlge3krsjglgztpwmsvzy6ry/DSCF0901.json";
    const json = NFTMetadataJSON;
  
    const encodedMetadataURI = erc725.encodeData([
      {
        keyName: "LSP4Metadata",
        value: {
          url,
          json,
        },
      },
    ]);
  
    // Extract the encoded metadata value for LSP4Metadata
    const lsp4MetadataKey = encodedMetadataURI.keys[0];
    const metadataValue = encodedMetadataURI.values[0];



    try {
      // @ts-ignore
      await window.lukso.request({ method: 'eth_requestAccounts' });

      // Get the active account from walletClient
      const accounts = await walletClient.getAddresses();
      if (!accounts.length) {
        throw new Error('No account found in Universal Profile Browser Extension. Please connect your wallet.');
      }
      const account = accounts[0];
      console.log('Active account:', account);

      // Verify the account matches the controller
      if (account.toLowerCase() !== props.collectionOwner.toLowerCase()) {
        throw new Error(
          `Please select the controller address ${props.collectionOwner} in the Universal Profile Browser Extension. Current account: ${account}`
        );
      }

      // Use a specific tokenId// Adjust if needed
      console.log('Using tokenId:', props.tokenId);

      // Verify tokenId exists
      // await verifyTokenId(tokenId);

      // Simulate the transaction
      console.log('Simulating transaction...');
      await simulateContract(publicClient, {
        address: lsp8ContractAddress as `0x${string}`,
        abi: lsp8IdentifiableDigitalAssetAbi,
        functionName: 'setDataForTokenId',
        args: [props.tokenId, lsp4MetadataKey as `0x${string}`, metadataValue as `0x${string}`],
        account,
      });
      console.log('Simulation successful.');

      // Send the transaction
      console.log('Sending transaction...');
      const txHash = await writeContract(walletClient, {
        address: lsp8ContractAddress as `0x${string}`,
        abi: lsp8IdentifiableDigitalAssetAbi,
        functionName: 'setDataForTokenId',
        args: [props.tokenId, lsp4MetadataKey as `0x${string}`, metadataValue as `0x${string}`],
        account,
      });

      console.log('Transaction hash:', txHash);
      setTxHash(txHash);

      // Wait for confirmation
      const receipt = await waitForTransactionReceipt(publicClient, {
        hash: txHash,
      });

      console.log('Transaction confirmed:', receipt);
      setErrorMessage('Transaction successful!');
    } catch (error: any) {
      console.error('Error setting metadata:', error);
      const message = error.message || 'Failed to set metadata. Please try again.';
      setErrorMessage(message);
    }
  }

  return (
    <div>
      <Button onClick={setMetadataForFirstToken}>Set Metadata</Button>
      {errorMessage && (
        <p className="text-red-500 mt-2">{errorMessage}</p>
      )}
      {txHash && (
        <p className="text-green-500 mt-2">
          Transaction sent: <a href={`https://explorer.testnet.lukso.network/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
        </p>
      )}
    </div>
  );
}