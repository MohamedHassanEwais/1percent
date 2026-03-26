"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { Check, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PremiumPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black -z-10" />

            <div className="mb-8 text-center">
                <Star className="h-12 w-12 text-[#CCFF00] mx-auto mb-4 animate-[spin_10s_linear_infinite]" />
                <h1 className="text-4xl font-heading font-black uppercase tracking-tighter">
                    Upgrade to <span className="text-[#CCFF00]">Pro</span>
                </h1>
                <p className="text-slate-400 mt-2">Unlock the full universe.</p>
            </div>

            <GlassCard className="w-full max-w-sm p-8 border-[#CCFF00]/50 shadow-[0_0_50px_rgba(204,255,0,0.1)]" intensity="high">
                <div className="text-center mb-6">
                    <span className="text-5xl font-bold text-white">$9</span>
                    <span className="text-slate-500">/month</span>
                </div>

                <ul className="space-y-4 mb-8">
                    {["Unlimited Reviews", "Full 3000 Words Access", "Offline Mode", "Advanced AI Stats"].map(feature => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                            <div className="h-5 w-5 rounded-full bg-[#CCFF00]/20 flex items-center justify-center">
                                <Check className="h-3 w-3 text-[#CCFF00]" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>

                <NeonButton className="w-full mb-4" size="lg">
                    Instantly Upgrade
                </NeonButton>
                <button onClick={() => router.back()} className="w-full text-xs text-slate-500 hover:text-white">
                    Maybe Later
                </button>
            </GlassCard>
        </div>
    );
}
