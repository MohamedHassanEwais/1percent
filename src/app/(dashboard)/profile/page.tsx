"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { Edit, Share2, Trophy } from "lucide-react";
import { useUserStore } from "@/core/store/user-store";

export default function ProfilePage() {
    const { xp, level, streak, nextLevelXp, user } = useUserStore();

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
                            {/* Use user photo or fallback */}
                            <div
                                className="h-full w-full rounded-full bg-slate-800 bg-cover bg-center"
                                style={{ backgroundImage: `url('${user.photoURL || "https://i.pravatar.cc/150?img=33"}')` }}
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-black rounded-lg px-2 py-1 border border-white/20">
                            <span className="text-xs font-bold text-[#CCFF00]">Lvl. {level}</span>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold">{user.displayName || "Cyber Nomad"}</h2>
                    <p className="text-slate-400 text-sm">{user.email || "Explorer Class"}</p>
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
                        <span className="text-2xl font-bold">{Math.floor(xp / 100)}</span>
                        <span className="text-xs text-slate-500 uppercase">Total Score</span>
                    </GlassCard>

                    <GlassCard className="p-4 flex flex-col items-center justify-center space-y-2">
                        <span className="text-2xl font-bold text-[#7C3AED]">🔥 {streak}</span>
                        <span className="text-xs text-slate-500 uppercase">Day Streak</span>
                    </GlassCard>
                </div>

                {/* Cloud Sync Status */}
                <GlassCard className="p-4 flex items-center justify-between" intensity="low">
                    <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${user.uid ? 'bg-green-500 shadow-[0_0_10px_#00ff00]' : 'bg-red-500'}`} />
                        <span className="text-sm font-bold text-slate-300">
                            {user.uid ? "Neural Cloud Connected" : "Local Mode (Not Synced)"}
                        </span>
                    </div>
                    {user.uid && <span className="text-xs text-slate-500 font-mono">ID: {user.uid.slice(0, 8)}...</span>}
                </GlassCard>

                <NeonButton className="w-full gap-2" variant="secondary">
                    <Share2 className="h-4 w-4" /> Share Profile
                </NeonButton>
            </div>
        </div>
    );
}
