'use client'

import Link from 'next/link';
import React from 'react';
import { Button } from '../lib/components/ui/button';

export const LandingPage = () => {
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center">
      <div className='flex flex-col items-center mt-12 max-w-md text-center'>
        <h1 className="font-finger-paint text-4xl mb-4">Breathing Life</h1>
        <p className="">“Breathing Life” is a creative tool for animating images into breath-taking visual experiences. Inspired by altered visionary states the images come to life in a natural way, while it is also possible to create otherworldly effects.</p>
        <p className='mt-8'>Comning very soon...</p>
      </div>
      {/* <p className="text-xl">Breathing Life is a next-gen shader application to create otherworldy visual animations.</p>
      <p className="text-xl">
        Visit
        <Link
          href="https://universal.page/drops/off-for-new-shores-test"
          target="_blank"
          className="underline text-blue-500"
          >this page on the Lukso Grid and start creating your own, unique visual experiences.</Link>
      </p>
      <Button>Get Started</Button> */}
    </div>
  );
};