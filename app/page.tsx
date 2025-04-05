'use client';

import { Button } from "./lib/components/ui/button";
import { Separator } from "./lib/components/ui/separator";
import { useUpProvider } from "./lib/providers/UpProvider";


export default function Home() {
  const upContext = useUpProvider()

  return (<>
    <div className="w-full h-full flex flex-col p-12 items-center">
      <h1 className="font-finger-paint text-4xl">Breathing Life</h1>
      <Separator className="my-4" />
      {upContext.accounts.length > 0 ? <>
        <div className="flex flex-col items-center">
          <Button>Get access</Button>
          <h1 className="mt-8">Connected profiles:</h1>
          {upContext.accounts.map((account) => <div key={account}>{account}</div>)}
        </div>
      </> : <div>Please connect your profile</div>}
    </div>
  </>);
}
