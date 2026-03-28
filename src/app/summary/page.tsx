"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Eye, Brain, ArrowLeft, Share2, X, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/core/store/user-store";

function SummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { level } = useUserStore();

  // Parse stats from URL query, default to 0 if not provided
  const reviewed = Number(searchParams.get("reviewed") || "0");
  const newLearned = Number(searchParams.get("new") || "0");

  return (
    <main className="bg-black min-h-screen text-white font-sans overflow-hidden relative selection:bg-accent selection:text-black rtl" dir="rtl">
      {/* Confetti / Particle Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-20" />
        
        {/* Large glow effect behind central content */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[120px]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col h-full min-h-screen w-full max-w-md mx-auto p-4">
        
        {/* Top App Bar */}
        <div className="flex items-center justify-between pb-4 pt-4">
          <button 
            onClick={() => router.push("/home")}
            className="text-white/60 hover:text-white transition-colors flex items-center justify-center p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h2 className="text-white text-lg font-bold tracking-tight">ملخص الجلسة</h2>
          
          <button className="flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors font-bold text-sm uppercase tracking-wider">
            <Share2 className="w-5 h-5" />
            مشاركة
          </button>
        </div>

        {/* Spacer for vertical centering */}
        <div className="flex-1 flex flex-col justify-center items-center py-8">
          
          {/* Headline Text */}
          <div className="text-center mb-8 relative">
            <h1 className="text-accent text-7xl md:text-8xl font-black leading-tight tracking-tighter drop-shadow-[0_0_15px_rgba(250,250,51,0.3)]" dir="ltr">
              Lvl {level}
            </h1>
            <p className="text-white text-2xl font-light opacity-90 mt-2">تسجيل إتمام الجلسة</p>
          </div>

          {/* Body Text */}
          <p className="text-gray-400 text-base font-normal leading-relaxed text-center max-w-[280px] mb-10">
            أداء رائع! أضفنا نقاط الجلسة لرصيدك. استمر في البناء المعرفي كل يوم.
          </p>

          {/* Stats Card (Glassmorphic) */}
          <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Decorative gradients */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600 rounded-full blur-[60px] opacity-20" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent rounded-full blur-[60px] opacity-10" />
            
            <div className="relative z-10 flex flex-col gap-6">
              
              {/* Stat Row 1 */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-xl font-bold">{reviewed}</span>
                    <span className="text-gray-400 text-xs text-right">كلمة لتثبيت الحفظ</span>
                  </div>
                </div>
                {reviewed > 0 && (
                  <div className="text-accent font-bold flex items-center gap-1 bg-accent/10 px-2 py-1 rounded text-sm shrink-0">
                    <TrendingUp className="w-4 h-4 rtl:-scale-x-100" /> +{Math.ceil(reviewed * 0.1)}%
                  </div>
                )}
              </div>

              {/* Stat Row 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-xl font-bold">{newLearned}</span>
                    <span className="text-gray-400 text-xs text-right">مفردات مكتسية حديثاً</span>
                  </div>
                </div>
                {newLearned > 0 && (
                  <div className="text-purple-400 font-bold flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded text-sm shrink-0">
                    <TrendingUp className="w-4 h-4 rtl:-scale-x-100" /> +{Math.ceil(newLearned * 0.5)}%
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="pb-8 pt-4 w-full px-2">
          <Link href="/home" className="group relative w-full flex items-center justify-center h-14 bg-accent text-black text-xl font-black rounded-xl shadow-[0_0_20px_rgba(250,250,51,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(250,250,51,0.6)] hover:scale-[1.02] active:scale-[0.98]">
            <span className="relative z-10 flex items-center gap-3">
              العودة للمركز الثابت
              <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
            </span>
            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SummaryContent />
    </Suspense>
  );
}
