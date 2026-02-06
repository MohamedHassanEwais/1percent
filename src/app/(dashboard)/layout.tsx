"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "lucide-react"; // Wait, Link is lucide icon. Next has Link.
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Trophy, Medal, Settings } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: "Map", href: "/map" },
        { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
        { icon: Medal, label: "Milestones", href: "/milestones" },
        { icon: User, label: "Profile", href: "/profile" },
        { icon: Settings, label: "Settings", href: "/settings" }, // Optional
    ];

    return (
        <div className="relative min-h-screen w-full bg-black overflow-hidden">
            {/* 
        This layout wraps the Galaxy Map, Profile, Leaderboard etc.
        It provides the persistent HUD (Heads-Up Display).
      */}

            {/* 1. Main Content Container */}
            <main className="relative h-full w-full">
                {children}
            </main>

            {/* 2. Bottom Navigation Dock (Mobile Friendly) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
                <GlassCard className="flex items-center justify-around px-2 py-3 backdrop-blur-2xl" intensity="high">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <NextLink key={item.href} href={item.href} className="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all hover:bg-white/5 active:scale-95">
                                <Icon className={`h-6 w-6 mb-1 transition-colors ${isActive ? 'text-[#CCFF00]' : 'text-slate-500'}`} />
                                {isActive && (
                                    <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]" />
                                )}
                            </NextLink>
                        );
                    })}
                </GlassCard>
            </div>

        </div>
    );
}
