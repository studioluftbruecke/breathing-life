'use client';

import { useState, useEffect } from 'react';
import { Separator } from "./lib/components/ui/separator";
import { useUpProvider } from "./lib/providers/UpProvider";

import {
  createPublicClient,
  http,
  parseAbi,
  Address,
  pad,
  keccak256,
  getContract,
  hexToString
} from 'viem';
import { luksoTestnet } from 'viem/chains';
import ShaderExperience from './lib/components/ShaderExperience';
import Link from 'next/link';
// import lsp8Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import { lsp8IdentifiableDigitalAssetAbi} from '@lukso/lsp-smart-contracts/abi';

import {
  ERC725YDataKeys,
} from '@lukso/lsp-smart-contracts/constants';
import SetLSP8MetadataButton from './SetLSP8MetadataButton';

// Interface for LSP4 Metadata
interface LSP4Metadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

const publicClient = createPublicClient({
  chain: luksoTestnet,
  transport: http(),
});


// const LSP8_ABI = parseAbi([
//   'function balanceOf(address owner) view returns (uint256)',
//   'function tokenIdsOf(address owner) view returns (bytes32[])',
//   'function getData(bytes32 key) view returns (bytes)',
//   'function getDataForTokenId(bytes32 tokenId, bytes32 dataKey) view returns (bytes)',
// ]);

// Contract address of Breathing Life - Test
const contractAddress = '0x47ab3d663c2053c9ca3091eb838ee7da2319df01';

// LSP4 Metadata key
const lsp4MetadataKey = ERC725YDataKeys.LSP4['LSP4Metadata'] as `0x${string}`
const lsp4TokenTypeKey = ERC725YDataKeys.LSP4['LSP4TokenType'] as `0x${string}`
const lsp4TokenNameKey = ERC725YDataKeys.LSP4['LSP4TokenName'] as `0x${string}`
const lsp4TokenSymbolKey = ERC725YDataKeys.LSP4['LSP4TokenSymbol'] as `0x${string}`


export default function Home() {
  const upContext = useUpProvider();
  const [accountHasAccess, setAccountHasAccess] = useState(false);
  const [breathingLifeTokenBalance, setBreathingLifeTokenBalance] = useState<number>();
  const [breathingLifeTokenIds, setBreathingLifeTokenIds] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<Map<string, LSP4Metadata>>(new Map()); // Map tokenId to metadata


  useEffect(() => {
    const fetchBreathingLifeTestBalance = async (address: Address) => {

      // Fetch balance
      const tokenIdsResult = await publicClient.readContract({
        address: contractAddress,
        abi: lsp8IdentifiableDigitalAssetAbi,
        functionName: 'tokenIdsOf',
        args: [address],
      });

      const myResult = await publicClient.readContract({
        address: contractAddress,
        abi: lsp8IdentifiableDigitalAssetAbi,
        functionName: 'getData',
        args: [lsp4TokenNameKey],
      });

      console.log('tokenIdsResult', tokenIdsResult)
      console.log('myResult', myResult)
      console.log('myResult decoded', hexToString(myResult as `0x${string}`))

      // Convert bytes32 token IDs to human-readable strings (hex format)
      const formattedTokenIds = tokenIdsResult as `0x${string}`[];
      setBreathingLifeTokenIds(formattedTokenIds);
      setBreathingLifeTokenBalance(formattedTokenIds.length);
      setAccountHasAccess(formattedTokenIds.length > 0);

      console.log('formattedTokenIds', formattedTokenIds)
      // Fetch metadata for each tokenId
      if (formattedTokenIds.length > 0) {
        const metadataMap = new Map<string, LSP4Metadata>();
        for (const tokenId of formattedTokenIds) {
          const tokenIdTyped = tokenId as `0x${string}`
          const metadataResult = await publicClient.readContract({
            address: contractAddress,
            abi: lsp8IdentifiableDigitalAssetAbi,
            functionName: 'getDataForTokenId',
            args: [tokenIdTyped, lsp4MetadataKey],
          });

          console.log('metadataResult', metadataResult)

          const metadataDecoded = hexToString(metadataResult);

          console.log('metadataDecoded', metadataDecoded)

          // // Decode metadata (assuming it's a JSON URL)
          // try {
          //   const decodedMetadata = Buffer.from(metadataResult.slice(2), 'hex').toString();
          //   if (decodedMetadata.startsWith('ipfs://')) {
          //     // Fetch JSON from IPFS
          //     const ipfsUrl = decodedMetadata.replace('ipfs://', 'https://ipfs.io/ipfs/');
          //     const response = await fetch(ipfsUrl);
          //     if (!response.ok) throw new Error('Failed to fetch metadata from IPFS');
          //     const metadataJson: LSP4Metadata = await response.json();
          //     metadataMap.set(tokenId, metadataJson);
          //   } else {
          //     // Assume direct JSON string (less common)
          //     const metadataJson: LSP4Metadata = JSON.parse(decodedMetadata);
          //     metadataMap.set(tokenId, metadataJson);
          //   }
          // } catch (error) {
          //   console.error(`Failed to parse metadata for tokenId ${tokenId}:`, error);
          //   metadataMap.set(tokenId, { name: 'Unknown', description: 'Metadata unavailable' });
          // }
        }
        setMetadata(metadataMap);
      } else {
        setMetadata(new Map());
      }
    }

    if (upContext.accounts && upContext.accounts[0]) {
      fetchBreathingLifeTestBalance(upContext.accounts[0]);
    } else {
      console.warn('No accounts found');
      setBreathingLifeTokenBalance(0);
      setAccountHasAccess(false);
    }
  }, [upContext.accounts])


  return (
    <>
      <div className="items-center justify-items-center min-h-dvh w-screen h-dvh">
        {!accountHasAccess ? <>
          <div className="flex flex-col p-12 items-center">
            <h1 className="font-finger-paint text-4xl">Breathing Life</h1>
            <Separator className="my-4" />
            {upContext.accounts && upContext.accounts[0] ? (
              <>
                <div className="flex flex-col items-center w-full max-w-2xl">
                  <h2 className="text-xl mt-4">Connected profile:</h2>
                  <div className="font-mono text-sm mb-4 break-all">{upContext.accounts[0]}</div>
                  <div className="font-mono text-sm mb-4 break-all">Could not find token ids. Please visit <Link
                    href="https://universal.page/drops/breathing-life-test"
                    target='_blank'
                    className='underline text-blue-500'
                  >Universal Page</Link> to get access or contact hi@studioluftbruecke.org if this is a mistake.</div>
                </div>
              </>
            ) : (
              <div>Please connect your profile on the top left of this window.</div>
            )}
          </div>
        </> : <>
          <div className='flex flex-col space-y-4'>
            {breathingLifeTokenIds.map((tokenId, index) => {
              return <span key={index} className='text-xl font-bold'>{tokenId}</span>
            })}
            <SetLSP8MetadataButton />
          </div>
        </>}
      </div>
    </>
  );
}