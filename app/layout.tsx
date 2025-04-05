import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from 'next-themes'
import { UpProvider } from "./lib/providers/UpProvider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const alumniSansPinstripe = localFont({
  src: "./fonts/AlumniSansPinstripe-Regular.ttf",
  variable: "--font-alumni-sans",
  weight: "100 900",
});
const electrolize = localFont({
  src: "./fonts/Electrolize-Regular.ttf",
  variable: "--font-electrolize",
  weight: "100 900",
});

const manrope = localFont({
  src: "./fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  weight: "100 900",
});

const carm = localFont({
  src: "./fonts/Charm-Regular.ttf",
  variable: "--font-charm",
  weight: "100 900",
});

const fingerPaint = localFont({
  src: "./fonts/FingerPaint-Regular.ttf",
  variable: "--font-finger-paint",
  weight: "100 900",
});

const rubikGlitch = localFont({
  src: "./fonts/RubikGlitch-Regular.ttf",
  variable: "--font-rubik-glitch",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Refraction X Lukso Proof Of Concept",
  description: "Just a proof of concept",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pink">
      <body
        className={`${alumniSansPinstripe.variable} ${electrolize.variable} ${manrope.variable} ${carm.variable} ${fingerPaint.variable} ${rubikGlitch.variable} antialiased font-manrope`}
      >
        <ThemeProvider enableSystem={false}>
          <UpProvider>
            {children}
          </UpProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
