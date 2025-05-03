"use client";

import { ReactNode } from "react";
import { UpProvider } from "@/lib/providers/UpProvider";
import { ApolloProvider } from '@apollo/client';
import { client } from "@/lib/components/apollo/apolloClient";
import { ProfileProvider } from "@/lib/providers/ProfileProvider";
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme" // Use data-theme attribute (default)
      defaultTheme="luft"   // Set the default theme
      themes={['light', 'dark', 'luft']} // Explicitly list available themes
      enableSystem={false} // Disable system theme preference if you only want manual selection
    >
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