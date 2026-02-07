import { VocabularyCard } from "@/core/domain/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { Volume2, Eye } from "lucide-react";
import { useEffect, useRef } from "react";

interface FlashcardFrontProps {
    card: VocabularyCard;
    onFlip: () => void;
}

export function FlashcardFront({ card, onFlip }: FlashcardFrontProps) {
    // Auto-play audio on mount
    useEffect(() => {
        // In real implementation, this would point to real URLs
        // if (card.audioUrl) new Audio(card.audioUrl).play();
    }, [card]);

    return (
        <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 h-full w-full"
        >
            <GlassCard className="flex h-full flex-col justify-between p-8 border-[#CCFF00]/20 shadow-[0_0_30px_rgba(204,255,0,0.05)]">

                {/* Top: Audio Visuals */}
                <div className="flex justify-center py-10">
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white/5 shadow-inner animate-pulse">
                        <Volume2 className="h-12 w-12 text-primary" />
                        {/* Simulated Audio Waves */}
                        <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_2s_infinite]" />
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
