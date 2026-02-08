"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useUserStore } from "@/core/store/user-store";
import { useEffect, useState } from "react";

// Simulated "Elite" Competitors to keep the board interesting
const initialComputers = [
    { id: "comp-1", name: "Ali Ahmed", xp: 15400, avatar: "https://i.pravatar.cc/150?img=11", isMe: false, level: 25 },
    { id: "comp-2", name: "Sarah Connor", xp: 14200, avatar: "https://i.pravatar.cc/150?img=5", isMe: false, level: 22 },
    { id: "comp-3", name: "Neo", xp: 13950, avatar: "https://i.pravatar.cc/150?img=3", isMe: false, level: 21 },
    { id: "comp-4", name: "Morpheus", xp: 900, avatar: "https://i.pravatar.cc/150?img=8", isMe: false, level: 12 },
    { id: "comp-5", name: "Trinity", xp: 1800, avatar: "https://i.pravatar.cc/150?img=9", isMe: false, level: 15 },
];

export default function LeaderboardPage() {
    const { xp, level, user } = useUserStore();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        // Construct User Object
        const currentUser = {
            id: "me",
            name: user.displayName || "You",
            xp: xp,
            avatar: user.photoURL || "https://i.pravatar.cc/150?img=33",
            isMe: true,
            level: level
        };

        // Merge and Sort
        const allUsers = [...initialComputers, currentUser];

        // Sort by XP (Descending)
        allUsers.sort((a, b) => b.xp - a.xp);

        // Assign Ranks
        const rankedUsers = allUsers.map((u, index) => ({
            ...u,
            rank: index + 1
        }));

        setLeaderboard(rankedUsers);
    }, [xp, level, user]);

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 overflow-y-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-black text-[#CCFF00] tracking-wider uppercase drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                    Elite Ranks
                </h1>
                <p className="text-slate-400 text-sm">Top 1% Performers this Week</p>
            </div>

            <div className="space-y-4">
                {leaderboard.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={user.isMe ? "sticky top-4 z-20" : ""} // Sticky user if we have a long list
                    >
                        <GlassCard
                            intensity={user.isMe ? "medium" : "low"}
                            glow={user.rank === 1 ? "lime" : user.isMe ? "violet" : "none"}
                            className={`flex items-center justify-between p-4 ${user.isMe ? 'border-secondary/50 ring-1 ring-secondary/30 scale-105 origin-center' : 'border-transparent'}`}
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
                                    <span className="text-xs text-slate-500">Level {user.level} Explorer</span>
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
