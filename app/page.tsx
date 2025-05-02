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
import { LandingPage } from './LandingPage';
import { MoveLeft } from 'lucide-react';
import { useProfile } from '@/lib/providers/ProfileProvider';
import Image from 'next/image';


const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LSP7_CONTRACT_ADDRESS;
const MAX_SUPPLY = Number(process.env.NEXT_PUBLIC_LSP7_CONTRACT_MAX_SUPPLY ?? 100);


export default function Home() {
  const upContext = useUpProvider();
  const { profileData } = useProfile();
  const [isClient, setIsClient] = useState(false);
  const [accountHasAccess, setAccountHasAccess] = useState(false);
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
      setAccountHasAccess(balance > 0);
    }

    if (upContext.accounts && upContext.accounts[0]) {
      fetchOffForNewShoresTestBalance(upContext.accounts[0]);
    } else {
      console.warn('No accounts found');
      setTokenBalance(0);
      setAccountHasAccess(false);
    }
  }, [upContext.accounts])


  if (!isClient) {
    console.log('Rendering null during server-side rendering');
    return null;
  }

  if (!upContext.isMiniApp) {
    return <LandingPage />
  }

  return (
    <>
      <div className="flex flex-col items-center w-screen h-dvh">
        {!accountHasAccess ? <>
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
        </> : <ShaderExperience />}
      </div>
    </>
  );
}