"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { CheckCircle2, Home, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use'; // Use custom hook or just standard window if no lib

export default function SessionSummaryPage() {
    const router = useRouter();
    // In a real app, we'd pull stats from a store/context
    const stats = {
        reviewed: 10,
        newLearned: 2,
        accuracy: "92%"
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-black p-6 text-white overflow-hidden">
            {/* Simple Confetti (Conditional based on score) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* We'd use a library here, simplified for now */}
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md text-center space-y-8 z-10"
            >

                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="rounded-full bg-[#CCFF00]/10 p-6 shadow-[0_0_40px_rgba(204,255,0,0.3)]">
                        <CheckCircle2 className="h-16 w-16 text-[#CCFF00]" />
                    </div>
                </div>

                <div>
                    <h1 className="text-4xl font-black italic font-heading uppercase text-white tracking-tighter">
                        Session Complete!
                    </h1>
                    <p className="text-slate-400 mt-2">Neural Link Updated Successfully.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <GlassCard className="p-4 flex flex-col items-center" intensity="low">
                        <span className="text-2xl font-bold text-white">{stats.reviewed}</span>
                        <span className="text-xs text-slate-500 uppercase">Words</span>
                    </GlassCard>
                    <GlassCard className="p-4 flex flex-col items-center" intensity="low">
                        <span className="text-2xl font-bold text-primary">+{stats.newLearned}</span>
                        <span className="text-xs text-slate-500 uppercase">New</span>
                    </GlassCard>
                    <GlassCard className="p-4 flex flex-col items-center" intensity="low">
                        <span className="text-2xl font-bold text-secondary">{stats.accuracy}</span>
                        <span className="text-xs text-slate-500 uppercase">Accuracy</span>
                    </GlassCard>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-6">
                    <NeonButton
                        onClick={() => router.push('/map')}
                        className="w-full"
                        size="lg"
                    >
                        <Home className="mr-2 h-4 w-4" /> Return to Galaxy
                    </NeonButton>

                    <NeonButton
                        onClick={() => router.push('/session')}
                        variant="ghost"
                        className="w-full"
                    >
                        <RotateCw className="mr-2 h-4 w-4" /> Study Again
                    </NeonButton>
                </div>

            </motion.div>
        </div>
    );
}
