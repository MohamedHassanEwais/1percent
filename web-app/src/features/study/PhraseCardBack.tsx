import { VocabularyCard } from "@/core/domain/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { Image as ImageIcon, Sparkles, BookOpen } from "lucide-react";

interface PhraseCardBackProps {
    card: VocabularyCard;
    onRate: (rating: 1 | 2 | 3 | 4) => void;
    mode?: 'new' | 'review';
}

export function PhraseCardBack({ card, onRate, mode = 'review' }: PhraseCardBackProps) {
    return (
        <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 h-full w-full"
        >
            <GlassCard className="flex h-full flex-col justify-between p-6 border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.1)]" glow="violet">

                {/* Content Section */}
                <div className="flex-1 flex flex-col items-center text-center space-y-6 overflow-y-auto pt-4">

                    {/* Phrase Title */}
                    <div>
                        <div className="flex items-center justify-center gap-2 text-pink-400 mb-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Phrase</span>
                        </div>
                        <h2 className="text-3xl font-black text-white font-heading tracking-tight leading-tight">{card.word}</h2>
                    </div>

                    {/* Translation */}
                    <div className="bg-white/5 px-6 py-4 rounded-xl border border-white/5 w-full">
                        <p className="text-xl text-pink-300 font-bold" dir="rtl">{card.translation || "No translation available"}</p>
                    </div>

                    {/* Definition */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-slate-500">
                            <BookOpen className="w-3 h-3" />
                            <span className="text-xs uppercase tracking-widest">Meaning</span>
                        </div>
                        <p className="text-base text-slate-300 italic px-4">
                            &quot;{card.definition}&quot;
                        </p>
                    </div>

                    {/* Example Sentence (Full) */}
                    <div className="w-full text-left bg-black/20 p-4 rounded-lg border border-white/5">
                        <p className="text-sm text-slate-400 mb-1">Context:</p>
                        <p className="text-base text-white font-medium">
                            {card.exampleSentence}
                        </p>
                    </div>

                </div>

                {/* SRS Actions */}
                <div className="mt-6">
                    {mode === 'new' ? (
                        <NeonButton
                            onClick={() => onRate(3)} // Default to 'Good' for new words to schedule for tomorrow
                            variant="primary" // Reusing primary but maybe should be pink?
                            size="lg"
                            className="w-full py-4 bg-pink-500 hover:bg-pink-400 border-pink-500 text-black"
                        >
                            <Sparkles className="mr-2 h-5 w-5" />
                            I UNDERSTAND
                        </NeonButton>
                    ) : (
                        <div className="grid grid-cols-4 gap-2">
                            <NeonButton onClick={() => onRate(1)} variant="danger" size="sm" className="flex flex-col h-auto py-3 gap-1">
                                <span className="text-xs opacity-70">Forgot</span>
                                <span className="text-lg font-bold">AGAIN</span>
                            </NeonButton>

                            <NeonButton onClick={() => onRate(2)} variant="ghost" size="sm" className="bg-white/5 flex flex-col h-auto py-3 gap-1 border border-white/10">
                                <span className="text-xs opacity-70">Hard</span>
                                <span className="text-lg font-bold">2d</span>
                            </NeonButton>

                            <NeonButton onClick={() => onRate(3)} variant="secondary" size="sm" className="flex flex-col h-auto py-3 gap-1">
                                <span className="text-xs opacity-70">Good</span>
                                <span className="text-lg font-bold">4d</span>
                            </NeonButton>

                            <NeonButton onClick={() => onRate(4)} variant="primary" size="sm" className="flex flex-col h-auto py-3 gap-1 bg-pink-500 hover:bg-pink-400 border-pink-500 text-black">
                                <span className="text-xs opacity-70">Easy</span>
                                <span className="text-lg font-bold">7d</span>
                            </NeonButton>
                        </div>
                    )}
                </div>

            </GlassCard>
        </motion.div>
    );
}
