"use client";

import { GalaxyCanvas } from "@/features/galaxy/GalaxyCanvas";
import { GlassCard } from "@/components/ui/GlassCard";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/core/store/user-store";
import { wordsRepo } from "@/core/services/words-repo";

export default function GalaxyMapPage() {
    const router = useRouter();
    const [sessionLimit, setSessionLimit] = React.useState(10);
    const { streak, level } = useUserStore();
    const [totalWords, setTotalWords] = useState(0);

    useEffect(() => {
        // Fetch real word count
        wordsRepo.getLearnedWordsCount().then(c => setTotalWords(c));
    }, []);

    // Simple level title logic based on numeric level
    const getLevelTitle = (lvl: number) => {
        if (lvl < 5) return "Rookie Explorer";
        if (lvl < 10) return "Space Cadet";
        if (lvl < 20) return "Star Voyager";
        return "Galaxy Master";
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black text-white">
            {/* 1. The Dynamic Galaxy Background */}
            <GalaxyCanvas onStarClick={(id) => console.log('Clicked star', id)} />

            {/* 2. HUD Overlay (Top) */}
            <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
                <GlassCard className="pointer-events-auto px-6 py-4 flex flex-col items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Current Streak</span>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-heading text-[#CCFF00]">{streak}</span>
                        <span className="text-sm">DAYS</span>
                    </div>
                </GlassCard>

                <div className="flex flex-col gap-2 items-end">
                    <GlassCard className="pointer-events-auto px-6 py-4 text-right">
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-1">Level {level}</span>
                        <h2 className="text-xl font-heading">{getLevelTitle(level)}</h2>
                    </GlassCard>

                    <GlassCard className="pointer-events-auto px-4 py-2 flex items-center gap-3">
                        <span className="text-xs text-slate-400 uppercase font-bold">Learned</span>
                        <span className="text-lg font-bold text-cyan-400">{totalWords}</span>
                        <span className="text-xs text-slate-500">Words</span>
                    </GlassCard>
                </div>
            </div>

            {/* 3. Action Bar (Bottom) */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-auto w-full max-w-sm flex flex-col gap-4 px-4">

                <div className="flex flex-col gap-4 w-full">
                    {/* Main Adventure Button */}
                    <button
                        onClick={() => router.push('/levels')}
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-heading font-bold text-xl py-4 rounded-xl shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.7)] transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>START ADVENTURE 🚀</span>
                    </button>

                    {/* Quick Review Button */}
                    <button
                        onClick={() => router.push(`/session?mode=review&limit=${sessionLimit}`)}
                        className="w-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] font-heading font-bold text-lg py-3 rounded-xl hover:bg-[#CCFF00]/20 transition-all active:scale-95"
                    >
                        REVIEW DUE CARDS 🧠
                    </button>

                    {/* Session Limit Selector (Optional, kept for Review) */}
                    <div className="flex justify-center gap-2 mt-2">
                        <span className="text-xs text-zinc-500 font-bold self-center mr-2">LIMIT:</span>
                        {[5, 10, 20].map((limit) => (
                            <button
                                key={limit}
                                onClick={() => setSessionLimit(limit)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${sessionLimit === limit
                                    ? "bg-zinc-700 text-white"
                                    : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"
                                    }`}
                            >
                                {limit}
                            </button>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
}
