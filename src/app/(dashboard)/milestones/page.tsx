"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";

import { wordsRepo } from "@/core/services/words-repo";
import { useUserStore } from "@/core/store/user-store";
import { useEffect, useState } from "react";

export default function MilestonesPage() {
    const { xp, streak } = useUserStore();
    const [learnedCount, setLearnedCount] = useState(0);

    useEffect(() => {
        wordsRepo.getLearnedWordsCount().then(setLearnedCount);
    }, []);

    const milestones = [
        {
            id: 1,
            title: "The Awakening",
            desc: "Learn your first 100 words",
            completed: learnedCount >= 100,
            xp: 500,
            icon: "🥚"
        },
        {
            id: 2,
            title: "Star Gazer",
            desc: "Reach a 7-day streak",
            completed: streak >= 7,
            xp: 300,
            icon: "🔭"
        },
        {
            id: 3,
            title: "Velocity",
            desc: "Reach 5000 XP",
            completed: xp >= 5000,
            xp: 1000,
            icon: "🚀"
        },
        {
            id: 4,
            title: "Supernova",
            desc: "Unlock 1000 words",
            completed: learnedCount >= 1000,
            xp: 5000,
            icon: "💥"
        },
        {
            id: 5,
            title: "The 1 Percent",
            desc: "Master all 3000 words",
            completed: learnedCount >= 3000,
            xp: 10000,
            icon: "👑"
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 overflow-y-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-black text-[#CCFF00] tracking-wider uppercase">
                    Evolution
                </h1>
                <p className="text-slate-400 text-sm">Your Journey from Egg to Galaxy</p>
            </div>

            <div className="relative space-y-8 pl-8 before:absolute before:left-[19px] before:top-0 before:h-full before:w-[2px] before:bg-white/10">
                {milestones.map((milestone, index) => {
                    const status = milestone.completed ? "completed" : (index === 0 || milestones[index - 1].completed) ? "unlocked" : "locked";

                    return (
                        <motion.div
                            key={milestone.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Timeline Node */}
                            <div className={`absolute -left-[41px] top-4 h-6 w-6 rounded-full border-4 border-black ${status === "completed" ? "bg-[#CCFF00]" :
                                status === "unlocked" ? "bg-white animate-pulse" : "bg-slate-800"
                                }`} />

                            <GlassCard
                                intensity={status === "locked" ? "low" : "medium"}
                                className={`p-4 ${status === "locked" ? "opacity-50 grayscale" : ""}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="text-3xl bg-white/5 rounded-lg h-12 w-12 flex items-center justify-center">
                                            {status === "locked" ? <Lock className="h-5 w-5 opacity-50" /> : milestone.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{milestone.title}</h3>
                                            <p className="text-sm text-slate-400">{milestone.desc}</p>
                                        </div>
                                    </div>

                                    {status === "completed" && (
                                        <CheckCircle2 className="text-[#CCFF00] h-6 w-6" />
                                    )}
                                </div>

                                <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-3">
                                    <span className="text-xs font-mono text-[#7C3AED] font-bold">Reward</span>
                                    <span className="text-sm font-bold text-white">{milestone.xp} XP</span>
                                </div>
                            </GlassCard>

                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
