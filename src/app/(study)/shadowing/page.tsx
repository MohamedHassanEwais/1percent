"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Play, Mic, RotateCcw, CheckCircle2, Volume2, Ear } from "lucide-react";

export default function ShadowingLabPage() {
  const router = useRouter();
  
  // States: 'idle' | 'playing-native' | 'recording' | 'processing' | 'results'
  const [phase, setPhase] = useState<'idle' | 'playing-native' | 'recording' | 'processing' | 'results'>('idle');
  const [matchScore, setMatchScore] = useState<number>(0);

  const mockPhrase = {
    english: "I've been working as a software engineer for 5 years.",
    arabic: "أعمل كمهندس برمجيات منذ 5 سنوات.",
    phonetics: "/aɪv bɪn ˈwɜːrkɪŋ əz ə ˈsɒftweər ɛnʤɪˈnɪər fɔːr 5 jɪərz/"
  };

  const handleNativePlay = () => {
    setPhase('playing-native');
    setTimeout(() => {
      setPhase('idle');
    }, 2000);
  };

  const handleRecordStart = () => {
    setPhase('recording');
    setTimeout(() => {
      setPhase('processing');
      setTimeout(() => {
        // Generate a random score between 80 and 98 for mockup
        setMatchScore(Math.floor(Math.random() * (98 - 80 + 1) + 80));
        setPhase('results');
      }, 1500);
    }, 2500);
  };

  const resetLab = () => {
    setPhase('idle');
    setMatchScore(0);
  };

  // Helper to generate mock Waveform UI
  const Waveform = ({ active, colorClass }: { active: boolean, colorClass: string }) => {
    const bars = Array.from({ length: 40 });
    return (
      <div className="flex items-center justify-center gap-[2px] h-16 w-full max-w-sm mx-auto">
        {bars.map((_, i) => {
          const height = active ? Math.max(10, Math.random() * 64) : 4;
          return (
            <div 
              key={i} 
              className={`w-1 rounded-full transition-all duration-150 ease-in-out ${colorClass}`}
              style={{ height: `${height}px` }}
            ></div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="bg-black min-h-screen text-white font-sans overflow-x-hidden flex flex-col relative" dir="rtl">
      
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-black/90 backdrop-blur-md px-4 py-4 justify-between border-b border-white/5 shadow-2xl">
        <button 
          onClick={() => router.back()} 
          className="text-gray-400 hover:text-white flex w-10 h-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <AudioLinesIcon className="w-5 h-5 text-purple-400" />
          <h2 className="text-white text-base font-bold tracking-tight">
            مختبر التظليل
          </h2>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 w-full max-w-xl mx-auto px-6 pt-10 pb-48 relative flex flex-col">
        
        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mb-10 text-center">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${phase === 'idle' || phase === 'playing-native' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>1. استمع</span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${phase === 'recording' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>2. انطق</span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${phase === 'processing' || phase === 'results' ? 'bg-accent/20 text-accent border-accent/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>3. قارن</span>
        </div>

        {/* Phrase Content */}
        <div className="text-center mb-12">
          <p className="text-gray-400 text-sm font-medium mb-3">{mockPhrase.arabic}</p>
          <h1 className="text-3xl font-black text-white leading-tight underline decoration-purple-500/30 underline-offset-8 ltr" dir="ltr">
            {mockPhrase.english}
          </h1>
          <p className="text-accent/80 font-mono text-sm mt-4 tracking-widest bg-accent/10 inline-block px-3 py-1 rounded ltr" dir="ltr">
            {mockPhrase.phonetics}
          </p>
        </div>

        {/* Action Area */}
        <div className="mt-auto flex flex-col items-center gap-8 w-full bg-[#1a1a1a] border border-gray-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {phase === 'idle' && (
            <>
              <p className="text-gray-400 text-sm">استمع وطابق النغمة والصوتيات</p>
              <button 
                onClick={handleNativePlay}
                className="w-20 h-20 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform"
              >
                <Volume2 className="w-10 h-10" />
              </button>
            </>
          )}

          {phase === 'playing-native' && (
            <div className="w-full flex flex-col items-center">
              <p className="text-purple-400 text-sm font-bold mb-6 animate-pulse mt-2">جاري التشغيل الأصلي...</p>
              <Waveform active={true} colorClass="bg-purple-500" />
            </div>
          )}

          {phase === 'recording' && (
            <div className="w-full flex flex-col items-center">
              <p className="text-red-400 text-sm font-bold mb-6 animate-pulse mt-2">جاري الاستماع إليك...</p>
              <Waveform active={true} colorClass="bg-red-500" />
            </div>
          )}

          {phase === 'processing' && (
            <div className="w-full flex flex-col items-center justify-center py-6">
              <div className="w-10 h-10 border-4 border-gray-700 border-t-accent rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm mt-4">جاري تحليل النطق والموجات...</p>
            </div>
          )}

          {phase === 'results' && (
            <div className="w-full flex flex-col items-center animate-in zoom-in duration-300">
              <p className="text-gray-400 text-sm mb-4">دقة تطابق النطق</p>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke={matchScore >= 90 ? '#4ade80' : matchScore >= 80 ? '#facc15' : '#ef4444'} 
                    strokeWidth="8" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * matchScore) / 100} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out" 
                  />
                </svg>
                <span className={`text-4xl font-black ${matchScore >= 90 ? 'text-green-400' : matchScore >= 80 ? 'text-accent' : 'text-red-400'} drop-shadow-md`}>
                  {matchScore}%
                </span>
              </div>
              
              <div className="flex gap-4 mt-8 w-full">
                <button 
                  onClick={resetLab}
                  className="flex-1 flex justify-center items-center gap-2 h-12 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  إعادة المحاولة
                </button>
                <button 
                  onClick={() => router.push('/summary?new=1&reviewed=0')}
                  className="flex-1 flex justify-center items-center gap-2 h-12 bg-accent hover:bg-yellow-400 text-black font-black rounded-xl shadow-[0_0_15px_rgba(250,250,51,0.3)] transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  متابعة
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Main Bottom Record Button (Only if not recording/processing/results) */}
      {(phase === 'idle' || phase === 'playing-native') && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/95 to-transparent pt-12 pb-8 px-6 flex justify-center pointer-events-none">
          <button 
            onClick={handleRecordStart}
            disabled={phase !== 'idle'}
            className="pointer-events-auto w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 border-4 border-black ring-2 ring-red-500/30"
          >
            <Mic className="w-8 h-8" />
          </button>
        </div>
      )}

    </main>
  );
}

// Custom simple icon for navbar
function AudioLinesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 10v3" />
      <path d="M6 6v11" />
      <path d="M10 3v18" />
      <path d="M14 8v7" />
      <path d="M18 5v13" />
      <path d="M22 10v3" />
    </svg>
  );
}
