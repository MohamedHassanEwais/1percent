import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SyncProvider } from "@/core/services/SyncProvider";
import { LanguageProvider } from "@/core/providers/LanguageProvider";

import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Delta Leap | AI Language Mastery",
  description: "Master the Oxford 3000 words with Spaced Repetition.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cn(inter.variable, spaceGrotesk.variable, "font-sans bg-background text-slate-300 antialiased")}>
        <LanguageProvider>
            <AuthProvider>
            <SyncProvider />
            {children}
            </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
