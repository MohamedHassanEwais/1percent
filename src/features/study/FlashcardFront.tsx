"use client";

import { VocabularyCard } from "@/core/domain/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { Volume2, Eye } from "lucide-react";
import { useEffect, useRef } from "react";

export interface FlashcardFrontProps {
    card: VocabularyCard;
    onFlip: () => void;
    status?: 'new' | 'learning' | 'review' | 'graduated';
}

export function FlashcardFront({ card, onFlip, status = 'new' }: FlashcardFrontProps) {
    // Auto-play audio on mount
    useEffect(() => {
        if (card.audioUrl) {
            const audio = new Audio(card.audioUrl);
            audio.play().catch(e => console.log("Audio play failed (interaction required):", e));
        }
    }, [card]);

    return (
        <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 h-full w-full"
        >
            <GlassCard className="flex h-full flex-col justify-between p-8 border-[#CCFF00]/20 shadow-[0_0_30px_rgba(204,255,0,0.05)] relative">

                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${status === 'new'
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                    : 'bg-orange-500/10 border-orange-500 text-orange-400'
                    }`}>
                    {status === 'new' ? 'New Word' : 'Review'}
                </div>

                {/* Top: Audio Visuals */}
                <div className="flex justify-center py-10">
                    <div
                        className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white/5 shadow-inner cursor-pointer hover:bg-white/10 transition-colors group"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent flip if we want to be safe, though flip is on button below
                            const audio = new Audio(card.audioUrl);
                            audio.play().catch(console.error);
                        }}
                    >
                        <Volume2 className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                        {/* Simulated Audio Waves */}
                        <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_2s_infinite]" />
                        <span className="absolute -bottom-8 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Tap to Replay</span>
                    </div>
                </div>

                {/* Center: Context Sentence (Blanked) */}
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl text-center leading-relaxed font-medium text-slate-300">
                        {/* Simple replace logic for demo */}
                        {card.exampleSentence.replace(/<highlight>.*?<\/highlight>/g, ' _______ ')}
                    </p>
                </div>

                {/* Bottom: Reveal Action */}
                <div className="mt-8">
                    <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-4">Tap to Reveal Meaning</p>
                    <NeonButton
                        onClick={onFlip}
                        className="w-full"
                        size="lg"
                    >
                        <Eye className="mr-2 h-4 w-4" /> REVEAL ANSWER
                    </NeonButton>
                </div>

            </GlassCard>
        </motion.div>
    );
}
