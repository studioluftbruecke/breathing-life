'use client';

import { useState, useEffect } from 'react';
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
import Link from 'next/link';
import { Button } from '@/lib/components/ui/button';
import { Info } from 'lucide-react';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LSP7_CONTRACT_ADDRESS;


export default function Home() {
  const { profileData } = useProfile();
  const { isMiniApp, accounts } = useUpProvider();
  const [isClient, setIsClient] = useState(false);
  const [userHasAccess, setUserHasAccess] = useState(false);

  useEffect(() => {
    console.log('Setting isClient to true');
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchOffForNewShoresTestBalance = async (address: Address) => {
      // Fetch balance
      const balanceResult = await publicClient.readContract({
        address: CONTRACT_ADDRESS as Address,
        abi: lsp7DigitalAssetAbi,
        functionName: 'balanceOf',
        args: [address],
      });
      const balance = Number(balanceResult);
      setUserHasAccess(balance > 0);
    }

    if (accounts && accounts[0]) {
      fetchOffForNewShoresTestBalance(accounts[0]);
    } else {
      console.warn('No accounts found');
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
      </div>
      <div className='fixed bottom-2 left-2 z-10 h-8 flex flex-row items-center'>
        <Link
          href={process.env.NEXT_PUBLIC_INFO_URL ?? 'https://studioluftbruecke.org'}
          target="_blank"
        >
          <Button
            variant={'ghost'}
            size={'icon'}
          >
            <Info size={16} className='text-muted-foreground' />
          </Button>
        </Link>
      </div>
      {isMiniApp && <>
        <div className='fixed bottom-2 right-2 z-10 h-8 flex flex-row items-center'>
          {profileData ? <>
            <div className='flex flex-row items-center justify-center text-sm text-muted-foreground'>
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