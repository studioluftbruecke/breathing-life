import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/providers/providers";


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
  title: "Breathing Life - Studio Luftbrücke",
  description: "Breathing Life is a next-gen shader application to create otherworldy visual animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="luft">
      <body
        className={`${alumniSansPinstripe.variable} ${electrolize.variable} ${manrope.variable} ${carm.variable} ${fingerPaint.variable} ${rubikGlitch.variable} antialiased font-electrolize`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
