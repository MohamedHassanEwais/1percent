"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { CheckCircle2, Home, RotateCw, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Helper for SearchParams
function SummaryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const reviewed = searchParams.get('reviewed') || '0';
    const newWords = searchParams.get('new') || '0';
    const accuracy = searchParams.get('accuracy') || '0';

    const accuracyVal = parseInt(accuracy as string);
    const accuracyColor = accuracyVal >= 80 ? "text-[#CCFF00]" : accuracyVal >= 60 ? "text-yellow-400" : "text-red-400";

    return (
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
                    <span className="text-2xl font-bold text-white">{reviewed}</span>
                    <span className="text-xs text-slate-500 uppercase">Review +</span>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-center" intensity="low">
                    <span className="text-2xl font-bold text-cyan-400">+{newWords}</span>
                    <span className="text-xs text-slate-500 uppercase">New</span>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-center" intensity="low">
                    <span className={`text-2xl font-bold ${accuracyColor}`}>{accuracy}%</span>
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
                    onClick={() => router.push('/session?mode=review')}
                    variant="ghost"
                    className="w-full"
                >
                    <RotateCw className="mr-2 h-4 w-4" /> Study Again
                </NeonButton>
            </div>

        </motion.div>
    );
}

export default function SessionSummaryPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-black p-6 text-white overflow-hidden">
            <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-primary" />}>
                <SummaryContent />
            </Suspense>
        </div>
    );
}
