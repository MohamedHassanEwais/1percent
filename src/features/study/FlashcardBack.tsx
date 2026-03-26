"use client";

import { VocabularyCard } from "@/core/domain/types";
import { motion } from "framer-motion";
import { RotateCcw, Frown, Smile, ThumbsUp, CheckCircle, Quote } from "lucide-react";

interface FlashcardBackProps {
  card: VocabularyCard;
  onRate: (rating: 1 | 2 | 3 | 4) => void;
  mode?: 'new' | 'review';
}

export function FlashcardBack({ card, onRate, mode = 'review' }: FlashcardBackProps) {
  // Clean highlights from example sentence for the back display
  const cleanedExample = card.exampleSentence.replace(/<highlight>(.*?)<\/highlight>/g, 
    '<span class="text-accent font-medium border-b border-accent/30">$1</span>'
  );

  return (
    <motion.div
      initial={{ rotateY: -90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: 90, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 h-full w-full perspective-1000"
    >
      <div className="relative w-full h-full bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Decorative inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center z-10 rtl text-center">
          
          <h1 className="text-white tracking-tight text-4xl md:text-5xl font-bold leading-tight mb-4 mt-2 drop-shadow-md">
            {card.word}
          </h1>
          
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-black border border-gray-800 mb-6">
            <p className="text-gray-400 text-lg font-mono tracking-wide">/{card.phonetic}/</p>
          </div>

          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />

          {/* Translation Container */}
          <div className="w-full mb-6 text-center">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-2">المعنى</p>
            <h3 className="text-accent text-2xl font-bold leading-snug drop-shadow-[0_0_8px_rgba(250,250,51,0.3)]">
              {card.translation}
            </h3>
            <p className="text-gray-300 text-sm mt-3 px-4 leading-relaxed font-light">
               "{card.definition}"
            </p>
          </div>

          {/* Example Sentence */}
          <div className="w-full bg-black/50 rounded-xl p-5 border border-gray-800 relative mt-auto mb-4">
            <Quote className="absolute top-3 left-3 text-gray-700 w-5 h-5" />
            <p 
              className="text-gray-200 text-lg font-light leading-relaxed text-center px-2 pt-2"
              dangerouslySetInnerHTML={{ __html: cleanedExample }}
              dir="ltr"
            />
          </div>

        </div>

        {/* Bottom SRS Actions */}
        <div className="w-full pt-2 z-20 mt-auto">
          {mode === 'new' ? (
            <button
              onClick={() => onRate(3)} // Default to 'Good' 
              className="w-full h-14 bg-accent hover:bg-yellow-400 text-black text-lg font-bold rounded-xl shadow-[0_0_15px_rgba(250,250,51,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-6 h-6" />
              <span>فهمتها جيداً</span>
            </button>
          ) : (
            <div className="grid grid-cols-4 gap-2 md:gap-3 rtl text-right flex-row-reverse">
              {/* Note: reversed logically for RTL layout naturally */}

              {/* Again Button */}
              <button 
                onClick={() => onRate(1)}
                className="flex flex-col items-center group/btn active:scale-95 transition-transform"
              >
                <div className="w-full aspect-square rounded-2xl bg-[#2a1d22] border border-red-500/30 flex flex-col items-center justify-center mb-1 shadow-none hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all relative overflow-hidden">
                  <span className="text-gray-400 text-[10px] mb-1 font-mono">&lt; 1م</span>
                  <RotateCcw className="text-red-500 w-7 h-7" />
                </div>
                <span className="text-red-500 font-medium text-[11px] md:text-xs">نسيت</span>
              </button>

              {/* Hard Button */}
              <button 
                onClick={() => onRate(2)}
                className="flex flex-col items-center group/btn active:scale-95 transition-transform"
              >
                <div className="w-full aspect-square rounded-2xl bg-[#2a241d] border border-orange-500/30 flex flex-col items-center justify-center mb-1 shadow-none hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all relative overflow-hidden">
                  <span className="text-gray-400 text-[10px] mb-1 font-mono">2ي</span>
                  <Frown className="text-orange-500 w-7 h-7" />
                </div>
                <span className="text-orange-500 font-medium text-[11px] md:text-xs">صعب</span>
              </button>

              {/* Good Button */}
              <button 
                onClick={() => onRate(3)}
                className="flex flex-col items-center group/btn active:scale-95 transition-transform"
              >
                <div className="w-full aspect-square rounded-2xl bg-[#1d222a] border border-blue-500/30 flex flex-col items-center justify-center mb-1 shadow-none hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all relative overflow-hidden">
                  <span className="text-gray-400 text-[10px] mb-1 font-mono">4ي</span>
                  <Smile className="text-blue-500 w-7 h-7" />
                </div>
                <span className="text-blue-500 font-medium text-[11px] md:text-xs">جيد</span>
              </button>

              {/* Easy Button */}
              <button 
                onClick={() => onRate(4)}
                className="flex flex-col items-center group/btn active:scale-95 transition-transform"
              >
                <div className="w-full aspect-square rounded-2xl bg-[#1d2a1d] border border-green-500/30 flex flex-col items-center justify-center mb-1 shadow-none hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all relative overflow-hidden">
                  <span className="text-gray-400 text-[10px] mb-1 font-mono">7ي</span>
                  <ThumbsUp className="text-green-500 w-7 h-7" />
                </div>
                <span className="text-green-500 font-medium text-[11px] md:text-xs">سهل</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
