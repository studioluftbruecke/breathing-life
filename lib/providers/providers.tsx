"use client";

import { ReactNode } from "react";
import { UpProvider } from "@/lib/providers/UpProvider";
import { ApolloProvider } from '@apollo/client';
import { client } from "@/lib/components/apollo/apolloClient";
import { ProfileProvider } from "@/lib/providers/ProfileProvider";
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="data-mode">
      <UpProvider>
        <ApolloProvider client={client}>
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </ApolloProvider>
      </UpProvider>
    </ThemeProvider>
  );
}