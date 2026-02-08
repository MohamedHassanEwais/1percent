"use client";

import { VocabularyCard } from "@/core/domain/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { Volume2, Eye, Sparkles } from "lucide-react";
import { useEffect } from "react";

export interface PhraseCardFrontProps {
    card: VocabularyCard;
    onFlip: () => void;
    status?: 'new' | 'learning' | 'review' | 'graduated';
}

export function PhraseCardFront({ card, onFlip, status = 'new' }: PhraseCardFrontProps) {
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
            <GlassCard
                className="flex h-full flex-col justify-between p-8 border-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.05)] relative"
                glow="violet" // Distinction for Phrases
            >

                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${status === 'new'
                    ? 'bg-pink-500/10 border-pink-500 text-pink-400'
                    : 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                    }`}>
                    <Sparkles className="w-3 h-3" />
                    {status === 'new' ? 'New Phrase' : 'Review'}
                </div>

                {/* Top: Audio Visuals */}
                <div className="flex justify-center py-10">
                    <div
                        className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white/5 shadow-inner cursor-pointer hover:bg-white/10 transition-colors group"
                        onClick={(e) => {
                            e.stopPropagation();
                            const audio = new Audio(card.audioUrl);
                            audio.play().catch(console.error);
                        }}
                    >
                        <Volume2 className="h-12 w-12 text-pink-400 group-hover:scale-110 transition-transform" />
                        {/* Simulated Audio Waves */}
                        <div className="absolute inset-0 rounded-full border border-pink-500/30 animate-[ping_2s_infinite]" />
                        <span className="absolute -bottom-8 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Tap to Replay</span>
                    </div>
                </div>

                {/* Center: Context Sentence (Blanked) */}
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <p className="text-sm text-pink-400 font-mono uppercase tracking-widest">Complete the phrase</p>
                    <p className="text-2xl text-center leading-relaxed font-serif text-slate-200">
                        {/* 
                           If exampleSentence has XML tags like <highlight>...</highlight>, replace them. 
                           Otherwise, if it's just text, we might show the whole thing? 
                           Ideally phrases should have a 'cloze' sentence. 
                           For now, we assume the exampleSentence contains the phrase.
                           We'll try to mask the phrase if possible, or just show the sentence.
                           Since seed data might not have <highlight>, we might need to do a string replace of the phrase.
                        */}
                        {card.exampleSentence.replace(new RegExp(card.word, 'gi'), '_______')}
                    </p>
                </div>

                {/* Bottom: Reveal Action */}
                <div className="mt-8">
                    <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-4">Tap to Reveal Meaning</p>
                    <NeonButton
                        onClick={onFlip}
                        className="w-full bg-pink-500 hover:bg-pink-400 text-black border-pink-500"
                        size="lg"
                    >
                        <Eye className="mr-2 h-4 w-4" /> REVEAL PHRASE
                    </NeonButton>
                </div>

            </GlassCard>
        </motion.div>
    );
}
