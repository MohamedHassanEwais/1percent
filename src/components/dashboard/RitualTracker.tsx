"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Check } from "lucide-react";

export function RitualTracker() {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const progress = [true, true, true, false, false, false, false]; // Demo Data

    return (
        <GlassCard className="p-4 flex justify-between items-center" intensity="low">
            {days.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border ${progress[idx]
                                ? "border-[#CCFF00] bg-[#CCFF00]/20 text-[#CCFF00]"
                                : "border-white/10 bg-transparent text-slate-600"
                            }`}
                    >
                        {progress[idx] ? <Check className="h-4 w-4" /> : <span className="text-xs">{day}</span>}
                    </div>
                </div>
            ))}
        </GlassCard>
    );
}
