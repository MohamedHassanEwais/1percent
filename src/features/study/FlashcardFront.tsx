"use client";

import { VocabularyCard } from "@/core/domain/types";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useEffect } from "react";

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
      className="absolute inset-0 h-full w-full cursor-pointer group perspective-1000"
      onClick={onFlip}
    >
      <div className="w-full h-full bg-[#1a1a1a] rounded-3xl relative overflow-hidden flex flex-col shadow-2xl border border-gray-800 transition-transform duration-300 group-hover:scale-[1.02]">
        
        {/* Background decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Status */}
        <div className="absolute top-6 w-full px-6 flex justify-between items-center z-20 rtl">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            {status === 'new' ? 'كلمة جديدة' : 'مراجعة'}
          </span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full gap-8 p-8">
          
          {/* Audio Icon Button */}
          <div 
            className="flex items-center justify-center w-24 h-24 rounded-full bg-black/40 border border-gray-800 backdrop-blur-md shadow-lg shadow-black group-hover:bg-black/60 transition-all duration-500 relative"
            onClick={(e) => {
              e.stopPropagation(); // Replay audio without flipping
              if (card.audioUrl) {
                const audio = new Audio(card.audioUrl);
                audio.play().catch(console.error);
              }
            }}
          >
            <Volume2 className="text-accent w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-full border border-accent/20 animate-[ping_2s_infinite]" />
          </div>

          <div className="text-center mt-4 px-4">
             {card.pos === 'phoneme' ? (
                <h2 className="text-5xl font-bold text-white mb-2">{card.word}</h2>
             ) : (
                <p className="text-xl leading-relaxed text-gray-300 font-medium rtl" dir="rtl">
                   {card.exampleSentence.replace(/<highlight>.*?<\/highlight>/g, ' ....... ')}
                </p>
             )}
          </div>

          {/* Tap Hint */}
          <div className="absolute bottom-8 text-gray-500 text-xs font-medium uppercase tracking-[0.2em] animate-pulse">
            انقر للقلب
          </div>
        </div>

        {/* Progress Bar Component mapping */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
          <div className="h-full bg-gradient-to-r from-yellow-600 to-accent w-1/3 shadow-[0_0_10px_rgba(250,250,51,0.5)]" />
        </div>
      </div>
    </motion.div>
  );
}
