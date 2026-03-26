"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { PhoneticSound } from "./phonetics-data";

interface SoundCardProps {
    sound: PhoneticSound;
    onClick: () => void;
}

export const SoundCard = ({ sound, onClick }: SoundCardProps) => {
    return (
        <GlassCard
            className="cursor-pointer hover:border-cyan-400/50 transition-all active:scale-95 group relative overflow-hidden"
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col items-center justify-center p-4 min-h-[120px]">
                <span className="text-4xl font-mono text-cyan-300 mb-2 font-bold group-hover:text-cyan-200 transition-colors">
                    {sound.ipa}
                </span>

                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
                    {sound.name}
                </span>

                <div className="flex gap-1 flex-wrap justify-center">
                    {sound.examples.slice(0, 2).map(ex => (
                        <span key={ex} className="text-[10px] bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-300">
                            {ex}
                        </span>
                    ))}
                </div>
            </div>

            {/* Subcategory Badge */}
            <div className="absolute top-2 right-2">
                {sound.subcategory === 'unvoiced' && (
                    <span className="w-2 h-2 rounded-full bg-slate-600 block" title="Unvoiced" />
                )}
                {sound.subcategory === 'voiced' && (
                    <span className="w-2 h-2 rounded-full bg-lime-400 block shadow-[0_0_5px_#CCFF00]" title="Voiced" />
                )}
            </div>
        </GlassCard>
    );
};
