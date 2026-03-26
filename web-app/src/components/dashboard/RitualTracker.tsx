"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Check } from "lucide-react";
import { useUserStore } from "@/core/store/user-store";

export function RitualTracker() {
    const { streak, xpToday, dailyGoal } = useUserStore();

    // Calculate progress percentage
    const progressPercent = Math.min((xpToday / dailyGoal) * 100, 100);

    return (
        <GlassCard className="p-4 flex justify-between items-center" intensity="low">

            {/* Streak Section */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center h-10 w-10 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00]">
                    <span className="font-bold font-heading text-lg">{streak}</span>
                </div>
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Streak</p>
                    <p className="text-sm font-bold text-white">Day {streak}</p>
                </div>
            </div>

            {/* Daily Goal Section */}
            <div className="flex-1 ml-8">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-bold">Daily Goal</span>
                    <span className="text-[#CCFF00] font-mono">{xpToday}/{dailyGoal} XP</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#CCFF00] transition-all duration-500 shadow-[0_0_10px_rgba(204,255,0,0.5)]"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

        </GlassCard>
    );
}
