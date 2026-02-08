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

                {/* Session Limit Selector */}
                <div className="flex justify-center gap-2 mb-2">
                    {[5, 10, 20, 30].map((limit) => (
                        <button
                            key={limit}
                            onClick={() => setSessionLimit(limit)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${sessionLimit === limit
                                ? "bg-white text-black shadow-[0_0_10px_white]"
                                : "bg-white/10 text-slate-400 hover:bg-white/20"
                                }`}
                        >
                            {limit}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => router.push(`/session?mode=new&limit=${sessionLimit}`)}
                        className="flex-1 bg-cyan-400 text-black font-heading font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:scale-105 transition-transform active:scale-95"
                    >
                        LEARN NEW 🚀
                    </button>
                    <button
                        onClick={() => router.push(`/session?mode=review&limit=${sessionLimit}`)}
                        className="flex-1 bg-[#CCFF00] text-black font-heading font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(204,255,0,0.6)] hover:scale-105 transition-transform active:scale-95"
                    >
                        REVIEW 🧠
                    </button>
                </div>

                <button
                    onClick={() => router.push(`/session?mode=phrases&limit=${Math.max(5, Math.floor(sessionLimit / 2))}`)}
                    className="w-full bg-pink-500 text-black font-heading font-bold text-lg py-3 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:scale-105 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>LEARN PHRASES</span>
                    <span className="text-sm bg-black/20 px-2 py-0.5 rounded-full">NEW ✨</span>
                </button>

                <button
                    onClick={() => router.push('/foundation/phonetics')}
                    className="w-full bg-slate-800/80 backdrop-blur text-cyan-400 border border-cyan-500/30 font-heading font-bold text-lg py-3 rounded-xl hover:bg-slate-700 hover:scale-105 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>PHONETICS LAB 🧪</span>
                </button>
            </div>
        </div>
    );
}
