import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SyncProvider } from "@/core/services/SyncProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "1 Percent | Better Every Day",
  description: "Master the Oxford 3000 words with Spaced Repetition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, spaceGrotesk.variable, "font-sans bg-black text-slate-400 antialiased")}>
        <SyncProvider />
        {children}
      </body>
    </html>
  );
}
