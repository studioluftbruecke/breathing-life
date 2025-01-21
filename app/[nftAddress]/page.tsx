"use client";


import ShaderExperience from "@/app/lib/components/ShaderExperience";

export default function Page({ params }: { params: { nftAddress: string } }) {
  return (
    <div className="items-center justify-items-center min-h-screen w-screen h-screen">
      <ShaderExperience nftAddress={params.nftAddress} />
    </div>
  );
}
