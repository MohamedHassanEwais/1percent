import { VocabularyCard } from "@/core/domain/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

interface FlashcardBackProps {
    card: VocabularyCard;
    onRate: (rating: 1 | 2 | 3 | 4) => void;
}

export function FlashcardBack({ card, onRate }: FlashcardBackProps) {
    return (
        <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 h-full w-full"
        >
            <GlassCard className="flex h-full flex-col justify-between p-6 border-[#7C3AED]/30 shadow-[0_0_30px_rgba(124,58,237,0.1)]" glow="violet">

                {/* Content Section */}
                <div className="flex-1 flex flex-col items-center text-center space-y-6 overflow-y-auto">

                    {/* Image Placeholder */}
                    <div className="w-full h-48 bg-white/5 rounded-lg flex items-center justify-center mb-2 border border-white/10">
                        {card.imageUrl ? (
                            <img src={card.imageUrl} alt={card.word} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <ImageIcon className="h-10 w-10 text-slate-600" />
                        )}
                    </div>

                    <div>
                        <h2 className="text-4xl font-black text-white font-heading tracking-tight">{card.word}</h2>
                        <span className="text-sm text-slate-400 font-mono">{card.phonetic}</span>
                    </div>

                    <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 w-full">
                        <p className="text-xl text-[#CCFF00] font-bold" dir="rtl">{card.translation}</p>
                    </div>

                    <p className="text-sm text-slate-300 italic px-4 border-l-2 border-primary/30">
                        &quot;{card.definition}&quot;
                    </p>
                </div>

                {/* SRS Actions */}
                <div className="mt-6 grid grid-cols-4 gap-2">
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

                    <NeonButton onClick={() => onRate(4)} variant="primary" size="sm" className="flex flex-col h-auto py-3 gap-1">
                        <span className="text-xs opacity-70">Easy</span>
                        <span className="text-lg font-bold">7d</span>
                    </NeonButton>
                </div>

            </GlassCard>
        </motion.div>
    );
}
