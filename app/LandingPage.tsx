'use client'

import Link from 'next/link';
import React from 'react';
import { Button } from './lib/components/ui/button';

export const LandingPage = () => {
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center">
      <h1 className="font-finger-paint text-4xl">Breathing Life</h1>
      <p className="text-xl">Breathing Life is a next-gen shader application to create otherworldy visual animations.</p>
      <p className="text-xl">
        Visit
        <Link
          href="https://universal.page/drops/off-for-new-shores-test"
          target="_blank"
          className="underline text-blue-500"
          >this page on the Lukso Grid and start creating your own, unique visual experiences.</Link>
      </p>
      <Button>Get Started</Button>
    </div>
  );
};