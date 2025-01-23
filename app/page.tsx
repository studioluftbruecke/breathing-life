'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/a61e22fb-0947-4dad-beb5-d812c25694df')
  }, [router])
  return (<></>);
}
