'use client';

import { useState, useEffect } from 'react';
import { Separator } from "../lib/components/ui/separator";
import { useUpProvider } from "../lib/providers/UpProvider";

import {
  createPublicClient,
  http,
  Address,
} from 'viem';
import { lukso, luksoTestnet } from 'viem/chains';
import ShaderExperience from '../lib/components/ShaderExperience';
import { Avatar, AvatarFallback, AvatarImage } from '@/lib/components/ui/avatar';


// Helper function to transform IPFS URL to Universal Profile cloud URL
function transformIpfsUrl(ipfsUrl: string): string {
  if (!ipfsUrl || !ipfsUrl.startsWith('ipfs://')) return '';
  const hash = ipfsUrl.replace('ipfs://', '');
  return `https://api.universalprofile.cloud/ipfs/${hash}`;
}


const publicClient = createPublicClient({
  chain: process.env.NEXT_PUBLIC_MODE === 'TEST' ? luksoTestnet : lukso,
  transport: http(),
});

import { lsp7DigitalAssetAbi } from '@lukso/lsp-smart-contracts/abi';
import { useProfile } from '@/lib/providers/ProfileProvider';
import Image from 'next/image';
import Link from 'next/link';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LSP7_CONTRACT_ADDRESS;
const MAX_SUPPLY = Number(process.env.NEXT_PUBLIC_LSP7_CONTRACT_MAX_SUPPLY ?? 100);


export default function Home() {
  const { profileData } = useProfile();
  const { isMiniApp, accounts } = useUpProvider();
  const [isClient, setIsClient] = useState(false);
  const [userHasAccess, setUserHasAccess] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<number>();
  const [totalSupply, setTotalSupply] = useState<number>();

  useEffect(() => {
    console.log('Setting isClient to true');
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function getTotalSupply() {
      try {
        const totalSupply = await publicClient.readContract({
          address: CONTRACT_ADDRESS as Address,
          abi: lsp7DigitalAssetAbi,
          functionName: 'totalSupply',
        });
        console.log('totalSupply', totalSupply);
        setTotalSupply(Number(totalSupply));
      } catch (error) {
        console.error('Error fetching total supply:', error);
        throw error;
      }
    }

    getTotalSupply();
  }, [])

  useEffect(() => {
    const fetchOffForNewShoresTestBalance = async (address: Address) => {
      // Contract address of Off For New Shores - Test

      // Fetch balance
      const balanceResult = await publicClient.readContract({
        address: CONTRACT_ADDRESS as Address,
        abi: lsp7DigitalAssetAbi,
        functionName: 'balanceOf',
        args: [address],
      });
      const balance = Number(balanceResult);
      setTokenBalance(balance);
      setUserHasAccess(balance > 0);
    }

    if (accounts && accounts[0]) {
      fetchOffForNewShoresTestBalance(accounts[0]);
    } else {
      console.warn('No accounts found');
      setTokenBalance(0);
      setUserHasAccess(false);
    }
  }, [accounts])


  if (!isClient) {
    console.log('Rendering null during server-side rendering');
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center w-screen h-dvh">
        <ShaderExperience
          userHasAccess={userHasAccess}
        />
        {/* {!accountHasAccess ? <>
          {!profileData && <>
            <div className='flex flex-col'>
              <div className='flex flex-row items-center mt-4'>
                <MoveLeft />
                <p className='ml-8'>Please connect your profile on the top left of this window.</p>
              </div>
              <Separator className="my-4" />
            </div>
          </>}
          <div className='flex flex-col items-center mt-12 max-w-md text-center'>
            <h1 className="font-finger-paint text-4xl mb-4">Breathing Life</h1>
            <p className="">“Breathing Life” is a creative tool for animating images into breath-taking visual experiences. Inspired by altered visionary states the images come to life in a natural way, while it is also possible to create otherworldly effects.</p>
          </div>
          {profileData && <>
            <div className='flex flex-col items-center mt-16'>
              <div className='flex flex-row items-center justify-center'>
                <span className='mr-4 text-sm'>Connected as:</span>
                <Avatar className='h-8 w-8 mr-2'>
                  <AvatarImage src={profileData.profileImages.length > 0 ? transformIpfsUrl(profileData.profileImages[0].url) : ''} />
                  <AvatarFallback>{profileData.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className=''>{profileData.name}</span>
              </div>
              <div>Get access by minting the access token here.</div>
              {totalSupply !== undefined && <>
                <div>Access tokens left: {MAX_SUPPLY - totalSupply}</div>
              </>}
            </div>
          </>}
        </> : <ShaderExperience />} */}
      </div>
      <div className='fixed bottom-2 left-2 z-50 h-8 flex flex-row items-center'>
        <Link
          href="https://studioluftbruecke.org"
          target="_blank"
        >
          <Image
            src="/Studio Luftbrücke Full Symbol.jpg"
            alt="Studio Luftbruecke Logo"
            width={50}
            height={50}
            className="rounded-full aspect-square object-cover h-8 w-8"
          />
        </Link>
      </div>
      {isMiniApp && <>
        <div className='fixed bottom-2 right-2 z-50 h-8 flex flex-row items-center'>
          {profileData ? <>
            <div className='flex flex-row items-center justify-center text-sm text-muted-foreground'>
              {/* <span className='mr-4'>Connected as:</span> */}
              {profileData.profileImages.length > 0 && <>
                <Avatar className='h-6 w-6 mr-2'>
                  <AvatarImage className='object-cover' src={transformIpfsUrl(profileData.profileImages[0].url)} />
                  <AvatarFallback>{profileData.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </>}
              <span className=''>{profileData.name}</span>
            </div>
          </> : <>
            <div className='text-sm text-muted-foreground'>Not connected</div>
          </>}
        </div>
      </>}
    </>
  );
}