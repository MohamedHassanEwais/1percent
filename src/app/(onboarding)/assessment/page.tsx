"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/core/store/user-store";

const levels = [
    { label: "Beginner", range: "0 - 500 words", value: "A1" },
    { label: "Intermediate", range: "500 - 1500 words", value: "B1" },
    { label: "Advanced", range: "1500 - 3000 words", value: "C1" },
];

export default function AssessmentPage() {
    const { setTargetLevel } = useUserStore();
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleContinue = () => {
        if (selected) {
            setTargetLevel(selected as any); // Type assertion for CEFRLevel
            router.push("/login");
        }
    };

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center p-6 bg-black text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-heading font-black uppercase text-white">
                        Level Check
                    </h1>
                    <p className="mt-2 text-slate-400">
                        Where should we start your journey in the galaxy?
                    </p>
                </div>

                <div className="space-y-4">
                    {levels.map((level) => (
                        <GlassCard
                            key={level.value}
                            className={`relative flex cursor-pointer items-center justify-between p-6 transition-all border-2 ${selected === level.value
                                ? "border-[#CCFF00] bg-white/10 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                                : "border-transparent hover:bg-white/5"
                                }`}
                            onClick={() => setSelected(level.value)}
                        >
                            <div>
                                <h3 className={`font-bold uppercase ${selected === level.value ? "text-[#CCFF00]" : "text-white"}`}>
                                    {level.label}
                                </h3>
                                <span className="text-sm text-slate-500">{level.range}</span>
                            </div>

                            {selected === level.value && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#CCFF00] text-black">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                        </GlassCard>
                    ))}
                </div>

                <NeonButton
                    className="w-full"
                    size="lg"
                    disabled={!selected}
                    onClick={handleContinue}
                >
                    Begin Journey <ChevronRight className="ml-2 h-4 w-4" />
                </NeonButton>
            </motion.div>
        </div>
    );
}
