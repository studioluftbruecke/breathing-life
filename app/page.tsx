'use client';

import { useState, useEffect } from 'react';
import { Separator } from "./lib/components/ui/separator";
import { useUpProvider } from "./lib/providers/UpProvider";

import {
  createPublicClient,
  http,
  parseAbi,
  Address,
} from 'viem';
import { lukso, luksoTestnet } from 'viem/chains';
import ShaderExperience from './lib/components/ShaderExperience';
import Link from 'next/link';


const publicClient = createPublicClient({
  chain: process.env.NEXT_PUBLIC_MODE === 'TEST' ? luksoTestnet : lukso,
  transport: http(),
});

import { lsp7DigitalAssetAbi } from '@lukso/lsp-smart-contracts/abi';
import { Button } from './lib/components/ui/button';
import { LandingPage } from './LandingPage';
import { MoveLeft } from 'lucide-react';


const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LSP7_CONTRACT_ADDRESS;
const MAX_SUPPLY = Number(process.env.NEXT_PUBLIC_LSP7_CONTRACT_MAX_SUPPLY ?? 100);


export default function Home() {
  const upContext = useUpProvider();
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


  const handleGetAccess = () => {
    console.log('handleGetAccess');
  }


  if (!isClient) {
    console.log('Rendering null during server-side rendering');
    return null;
  }

  if (!upContext.isMiniApp) {
    return <LandingPage />
  }


  return (
    <>
      <div className="items-center justify-items-center min-h-dvh w-screen h-dvh">
        {!accountHasAccess ? <>
          <div className="flex flex-col items-center h-full">
            <div className='flex flex-col'>
              <div className='flex flex-row items-center mt-4'>
                <MoveLeft />
                <p className='ml-8'>Please connect your profile on the top left of this window.</p>
              </div>
              <Separator className="my-4" />
            </div>
            <div className='flex flex-col items-center mt-12 max-w-md text-center'>
              <h1 className="font-finger-paint text-4xl mb-4">Breathing Life</h1>
              <p className="text-sm mb-4">“Breathing Life” is a creative tool for animating images into breath-taking visual experiences. Inspired by altered visionary states the images come to life in a natural way, while it is also possible to create otherworldly effects.</p>
              {totalSupply !== undefined && <>
                <div>Access tokens left: {MAX_SUPPLY - totalSupply}</div>
              </>}
            </div>
            <div></div>
            {/* {upContext.accounts && upContext.accounts[0] ? (
              <>
                <div className="flex flex-col items-center w-full max-w-2xl">
                  <h2 className="text-xl mt-4">Connected profile:</h2>
                  <div className="font-mono text-sm mb-4 break-all">{upContext.accounts[0]}</div>
                  <div className="font-mono text-sm mb-4 break-all">You don't have access to this app. Please visit <Link
                    href="https://universal.page/drops/off-for-new-shores-test"
                    target='_blank'
                    className='underline text-blue-500'
                  >Universal Page</Link> to get access or contact hi@studioluftbruecke.org if this is a mistake.</div>
                  {totalSupply !== undefined && <>
                    <div>Access tokens left: {MAX_SUPPLY - totalSupply}</div>
                  </>}
                  <Button onClick={handleGetAccess}>Get Access</Button>
                </div>
              </>
            ) : (
              <div>Please connect your profile on the top left of this window.</div>
            )} */}
          </div>
        </> : <>
          <ShaderExperience />
        </>}
      </div>
    </>
  );
}