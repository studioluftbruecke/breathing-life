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
import { luksoTestnet } from 'viem/chains';
import ShaderExperience from './lib/components/ShaderExperience';
import Link from 'next/link';


const publicClient = createPublicClient({
  chain: luksoTestnet,
  transport: http(),
});

const LSP7_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)'
]);


export default function Home() {
  const upContext = useUpProvider();
  const [accountHasAccess, setAccountHasAccess] = useState(false);
  const [offForNewShoresTokenBalance, setOffForNewShoresTokenBalance] = useState<number>();

  useEffect(() => {
    const fetchOffForNewShoresTestBalance = async (address: Address) => {
      // Contract address of Off For New Shores - Test
      const contractAddress = '0x726993bdddf47407e79f8ee164ec2dc23b73bb41';

      // Fetch balance
      const balanceResult = await publicClient.readContract({
        address: contractAddress,
        abi: LSP7_ABI,
        functionName: 'balanceOf',
        args: [address],
      });
      const balance = Number(balanceResult);
      setOffForNewShoresTokenBalance(balance);
      setAccountHasAccess(balance > 0);
    }

    if (upContext.accounts && upContext.accounts[0]) {
      fetchOffForNewShoresTestBalance(upContext.accounts[0]);
    } else {
      console.warn('No accounts found');
      setOffForNewShoresTokenBalance(0);
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
                  <div className="font-mono text-sm mb-4 break-all">You don't have access to this app. Please visit <Link
                    href="https://universal.page/drops/off-for-new-shores-test"
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
          <ShaderExperience />
        </>}
      </div>
    </>
  );
}