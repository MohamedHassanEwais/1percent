"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { Edit, Share2, Trophy } from "lucide-react";
import { useUserStore } from "@/core/store/user-store";

export default function ProfilePage() {
    const { xp, level, streak, nextLevelXp } = useUserStore();

    // Calculate progress percentage
    const progress = Math.min(100, (xp / nextLevelXp) * 100);

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 overflow-y-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-heading font-bold uppercase">Identity</h1>
                <NeonButton variant="outline" size="sm" className="h-8 w-8 p-0 border-white/20">
                    <Edit className="h-4 w-4" />
                </NeonButton>
            </header>

            <div className="space-y-6">
                {/* Avatar & Main Stats */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="h-28 w-28 rounded-full border-2 border-[#CCFF00] p-1 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                            <div className="h-full w-full rounded-full bg-slate-800 bg-[url('https://i.pravatar.cc/150?img=33')] bg-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-black rounded-lg px-2 py-1 border border-white/20">
                            <span className="text-xs font-bold text-[#CCFF00]">Lvl. {level}</span>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold">Cyber Nomad</h2>
                    <p className="text-slate-400 text-sm">Explorer Class</p>
                </div>

                {/* XP Bar */}
                <GlassCard className="p-4" intensity="low">
                    <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                        <span>{xp} XP</span>
                        <span>{nextLevelXp} XP</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-[#CCFF00] to-[#7C3AED]"
                        />
                    </div>
                </GlassCard>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <GlassCard className="p-4 flex flex-col items-center justify-center space-y-2">
                        <Trophy className="h-6 w-6 text-[#CCFF00]" />
                        <span className="text-2xl font-bold">#420</span>
                        <span className="text-xs text-slate-500 uppercase">Global Rank</span>
                    </GlassCard>

                    <GlassCard className="p-4 flex flex-col items-center justify-center space-y-2">
                        <span className="text-2xl font-bold text-[#7C3AED]">🔥 {streak}</span>
                        <span className="text-xs text-slate-500 uppercase">Day Streak</span>
                    </GlassCard>
                </div>

                {/* Achievements Preview (static for now) */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-300">Recent Milestones</h3>
                        <span className="text-xs text-primary cursor-pointer">View All</span>
                    </div>
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <GlassCard key={i} className="flex items-center p-3 gap-3" intensity="low">
                                <div className="h-10 w-10 rounded bg-white/5 flex items-center justify-center text-xl">
                                    {i === 1 ? '🚀' : i === 2 ? '🌌' : '🧠'}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">First Steps</h4>
                                    <p className="text-xs text-slate-500">Completed 100 words</p>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                <NeonButton className="w-full gap-2" variant="secondary">
                    <Share2 className="h-4 w-4" /> Share Profile
                </NeonButton>
            </div>
        </div>
    );
}
