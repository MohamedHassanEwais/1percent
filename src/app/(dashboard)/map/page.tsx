"use client";

import { GalaxyCanvas } from "@/features/galaxy/GalaxyCanvas";
import { GlassCard } from "@/components/ui/GlassCard";
import React from "react";
import { useRouter } from "next/navigation";

export default function GalaxyMapPage() {
    const router = useRouter();

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black text-white">
            {/* 1. The Dynamic Galaxy Background */}
            <GalaxyCanvas onStarClick={(id) => console.log('Clicked star', id)} />

            {/* 2. HUD Overlay (Top) */}
            <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
                <GlassCard className="pointer-events-auto px-6 py-4 flex flex-col items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Current Streak</span>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-heading text-[#CCFF00]">12</span>
                        <span className="text-sm">DAYS</span>
                    </div>
                </GlassCard>

                <GlassCard className="pointer-events-auto px-6 py-4">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-1">Level</span>
                    <h2 className="text-xl font-heading">Rookie Explorer</h2>
                </GlassCard>
            </div>

            {/* 3. Action Bar (Bottom) - Moved up to avoid nav overlap */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-auto w-full max-w-xs flex justify-center">
                <button
                    onClick={() => router.push('/session')}
                    className="bg-[#CCFF00] text-black font-heading font-bold text-lg px-12 py-4 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.6)] hover:scale-105 transition-transform active:scale-95 w-full"
                >
                    LAUNCH SESSION 🚀
                </button>
            </div>
        </div>
    );
}
