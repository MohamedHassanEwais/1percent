"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const leaderboardData = [
    { rank: 1, name: "Ali Ahmed", xp: 15400, avatar: "https://i.pravatar.cc/150?img=11" },
    { rank: 2, name: "Sarah Connor", xp: 14200, avatar: "https://i.pravatar.cc/150?img=5" },
    { rank: 3, name: "Neo", xp: 13950, avatar: "https://i.pravatar.cc/150?img=3" },
    { rank: 4, name: "You", xp: 1250, avatar: "https://i.pravatar.cc/150?img=33", isMe: true }, // Current User
    { rank: 5, name: "Morpheus", xp: 900, avatar: "https://i.pravatar.cc/150?img=8" },
];

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 overflow-y-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-black text-[#CCFF00] tracking-wider uppercase drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                    Elite Ranks
                </h1>
                <p className="text-slate-400 text-sm">Top 1% Performers this Week</p>
            </div>

            <div className="space-y-4">
                {/* Top 3 Podium (Simplified as list for now, maybe 3D laters) */}

                {leaderboardData.map((user, index) => (
                    <motion.div
                        key={user.rank}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GlassCard
                            intensity={user.isMe ? "medium" : "low"}
                            glow={user.rank === 1 ? "lime" : user.isMe ? "violet" : "none"}
                            className={`flex items-center justify-between p-4 ${user.isMe ? 'border-secondary/50' : 'border-transparent'}`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Rank Number */}
                                <div className="flex-shrink-0 w-8 text-center font-bold text-xl font-heading">
                                    {user.rank === 1 ? <Crown className="h-6 w-6 text-[#CCFF00] mx-auto" /> : `#${user.rank}`}
                                </div>

                                {/* Avatar */}
                                <div className="h-12 w-12 rounded-full border border-white/10 bg-slate-800 overflow-hidden">
                                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                </div>

                                {/* Name */}
                                <div>
                                    <h3 className={`font-bold ${user.isMe ? 'text-secondary' : 'text-white'}`}>
                                        {user.name} {user.isMe && '(You)'}
                                    </h3>
                                    <span className="text-xs text-slate-500">Level 5 Explorer</span>
                                </div>
                            </div>

                            {/* Score */}
                            <div className="text-right">
                                <span className="block font-bold text-[#CCFF00] text-lg">{user.xp.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider">XP</span>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
