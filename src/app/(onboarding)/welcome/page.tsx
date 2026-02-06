"use client";

import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const slides = [
    {
        id: 1,
        title: "THE 80/20 RULE",
        desc: "English has 170,000 words. You only need the top 3,000 to understand 85% of daily conversation.",
        visual: "🎯"
    },
    {
        id: 2,
        title: "AUDIO FIRST",
        desc: "Babies listen before they speak. We train your ears first. No text, just pure sound and meaning.",
        visual: "🎧"
    },
    {
        id: 3,
        title: "ACTIVE RECALL",
        desc: "We don't do multiple choice. We force your brain to retrieve the memory. It's harder, but 10x faster.",
        visual: "⚡"
    }
];

export default function WelcomePage() {
    const router = useRouter();
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        if (current < slides.length - 1) {
            setCurrent((prev) => prev + 1);
        } else {
            router.push("/assessment");
        }
    };

    return (
        <div className="flex h-screen w-full flex-col items-center justify-between p-6 pb-12">
            {/* 1. Progress Indicators (Top) */}
            <div className="mt-8 flex w-full max-w-xs gap-2">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1 flex-1 rounded-full transition-colors duration-500 ${idx <= current ? "bg-primary shadow-[0_0_10px_#CCFF00]" : "bg-white/10"
                            }`}
                    />
                ))}
            </div>

            {/* 2. Main Content (Center) */}
            <GlassCard className="relative flex w-full max-w-sm flex-col items-center p-8 text-center min-h-[400px] justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        {/* Visual (Emoji for now, replaced by 3D later) */}
                        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/5 text-6xl shadow-inner">
                            {slides[current].visual}
                        </div>

                        <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide text-white font-heading">
                            {slides[current].title}
                        </h2>
                        <p className="text-lg leading-relaxed text-slate-400">
                            {slides[current].desc}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </GlassCard>

            {/* 3. Action (Bottom) */}
            <motion.div
                className="w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <NeonButton
                    onClick={nextSlide}
                    className="w-full gap-2 shadow-neon-lime"
                    size="lg"
                    variant="primary"
                >
                    {current === slides.length - 1 ? "Start Assessment" : "Continue"}
                    <ArrowRight className="h-4 w-4" />
                </NeonButton>
            </motion.div>
        </div>
    );
}
