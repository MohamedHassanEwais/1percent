"use client";

import { Flame, Edit3, TrendingUp, Brain, ArrowLeft, BookOpen, Mic, ChevronRight, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserStore } from "@/core/store/user-store";
import { db } from "@/lib/db";

export default function DashboardHome() {
  const { xp, level, nextLevelXp, streak, dailyGoal, xpToday, focusHours, efficiencyScore } = useUserStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Prevent hydration mismatch

  // Calculate dynamic progress values
  const levelProgress = Math.min(100, Math.max(0, Math.floor((xp / nextLevelXp) * 100)));
  const dailyProgress = Math.min(100, Math.max(0, Math.floor((xpToday / dailyGoal) * 100)));
  const circleOffset = 264 - (264 * levelProgress) / 100;


  return (
    <div className="flex-1 flex flex-col items-center w-full px-4 pt-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="flex flex-row-reverse items-center justify-between w-full max-w-2xl mb-6">
        <div className="flex flex-row-reverse items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-l from-accent to-yellow-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-200" />
            <div className="relative w-10 h-10 rounded-full border border-gray-700 overflow-hidden bg-gray-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhzeysoFcxDUMYZqgCQ6qkEcCAheziKCAX5JDEnkmiEa547TYgtvNvnxU5zBKelU2EJVemNgHGuonFnQkXwVnOODm0NWHVLpgINk7RHTQwaEGScKi3s2l1xgdPa5epitzRpgwI5QT16vrFomJhU2NXNJcWTM0l7XkCEjQ99qbjh8NaGOvLeFkluXe2PF3jexllGwwiXt7fpOExsI4oy9WQPXOFo66YPw-OdW4x0biggVXkkCeWijBknFCPmQIEkhGPDxntn0yUovM" 
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col text-right">
            <h2 className="text-white text-lg font-bold leading-none tracking-tight">المركز الثابت</h2>
            <span className="text-xs text-gray-400 font-medium mt-1">مساء الخير</span>
          </div>
        </div>
        
        <div className="flex flex-row-reverse items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 shadow-inner">
          <Flame className="text-accent w-4 h-4 fill-accent/20" />
          <p className="text-accent text-sm font-bold tracking-wide drop-shadow-[0_0_10px_rgba(250,250,51,0.3)]">
            الحماس: {streak}
          </p>
        </div>
      </header>

      {/* Main Focus Ring */}
      <div className="w-full max-w-2xl relative flex flex-col items-center justify-center py-10 my-4 rounded-3xl bg-black border border-gray-800 shadow-[inset_0_0_60px_-10px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,250,51,0.05),transparent_70%)] pointer-events-none" />
        
        <div className="relative w-64 h-64 md:w-72 md:h-72">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Track bg */}
            <circle cx="50" cy="50" r="42" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-gray-800" />
            {/* Progress Dynamic */}
            <circle cx="50" cy="50" r="42" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray="264" strokeDashoffset={circleOffset} strokeLinecap="round" className="text-accent drop-shadow-[0_0_8px_rgba(250,250,51,0.6)] transition-all duration-1000 ease-out" />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tighter" dir="ltr">Lvl {level}</span>
            <span className="text-sm uppercase tracking-widest text-accent mt-2 font-bold">{xp} / {nextLevelXp} XP</span>
          </div>
          
          <div className="absolute inset-0 rounded-full border border-gray-800 border-dashed animate-[spin_60s_linear_infinite]" />
        </div>
        
        <p className="mt-4 text-center text-gray-400 text-sm font-medium">الخطوات الصغيرة، تصنع الفارق العظيم.</p>
      </div>

      {/* Today's Goal */}
      <div className="w-full max-w-2xl mt-6">
        <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1a1a1a] border border-gray-800 transition-all hover:border-accent/30 p-1 rtl text-right">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/10 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="relative flex flex-col gap-4 p-5">
            <div className="flex flex-row gap-4 items-start justify-end">
              <div className="flex-1 flex flex-col justify-center gap-1">
                <div className="flex flex-row-reverse justify-between items-start">
                  <div>
                    <h3 className="text-white text-xl font-bold leading-tight tracking-tight">هدف اليوم المستمر</h3>
                    <p className="text-accent text-sm font-medium mt-1">البناء المعرفي</p>
                  </div>
                  <div className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">يومي</div>
                </div>
                
                <div className="flex flex-row-reverse items-end justify-between mt-4 gap-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">الهدف</p>
                    <p className="text-white text-2xl font-bold leading-none flex flex-row-reverse gap-1 items-end">
                      {dailyGoal} <span className="text-sm font-normal text-gray-400">نقطة XP</span>
                    </p>
                  </div>
                  <Link href="/session">
                    <button className="flex flex-row-reverse items-center justify-center h-10 px-6 bg-accent hover:bg-yellow-400 text-black text-sm font-bold uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(250,250,51,0.4)] transition-all active:scale-95 gap-2">
                      <span>ابدأ</span>
                      <ArrowLeft className="w-4 h-4 mr-1" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="shrink-0 flex items-center h-full">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shadow-inner">
                  <Edit3 className="text-accent/80 w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress bar inside card */}
          <div className="mx-5 mb-5 mt-1">
            <div className="h-1.5 w-full bg-gray-800 rounded-full flex justify-end overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000 shadow-[0_0_8px_rgba(250,250,51,0.5)]" 
                style={{ width: `${dailyProgress}%` }}
              />
            </div>
            <div className="flex flex-row-reverse justify-between mt-2">
              <span className="text-[10px] text-gray-500">{dailyProgress}% مکتمل</span>
              <span className="text-[10px] text-gray-500">{xpToday} XP اليوم</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mt-6 mb-8 rtl text-right">
        
        {/* Stat 1 */}
        <div className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-xl flex flex-col gap-2">
          <div className="flex flex-row-reverse items-center justify-start gap-2 text-gray-400 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs uppercase font-medium tracking-wide">الكفاءة</span>
          </div>
          <p className="text-2xl font-bold text-white ltr" dir="ltr">+{efficiencyScore.toFixed(1)}%</p>
          <div className="w-full bg-gray-800 h-1 rounded-full mt-2 flex justify-end">
            <div 
               className="h-full bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)] transition-all" 
               style={{ width: `${Math.min(100, efficiencyScore * 5)}%` }}
            />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-xl flex flex-col gap-2">
          <div className="flex flex-row-reverse items-center justify-start gap-2 text-gray-400 mb-1">
            <Brain className="w-5 h-5" />
            <span className="text-xs uppercase font-medium tracking-wide">التركيز</span>
          </div>
          <p className="text-2xl font-bold text-white ltr" dir="ltr">{focusHours.toFixed(1)} h</p>
          <div className="w-full bg-gray-800 h-1 rounded-full mt-2 flex justify-end">
            <div 
              className="h-full bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)] transition-all" 
              style={{ width: `${Math.min(100, (focusHours / 10) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Other Engines */}
      <div className="w-full max-w-2xl flex flex-col gap-4 mb-20 rtl text-right">
        <h3 className="text-white text-lg font-bold">محركات التعلم الإضافية</h3>
        
        <Link href="/reader" className="group rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="text-white font-bold">القارئ المفهوم</h4>
              <p className="text-xs text-gray-400 mt-1">تدرب على الفهم القرائي العام</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors rtl:rotate-180" />
        </Link>
        
        <Link href="/shadowing" className="group rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Mic className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-bold">مختبر التظليل</h4>
              <p className="text-xs text-gray-400 mt-1">قارن نطقك بالنطق الأصلي</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors rtl:rotate-180" />
        </Link>

        <Link href="/tutor" className="group rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-bold">المعلم الذكي (AI)</h4>
              <p className="text-xs text-gray-400 mt-1">تدرب على المحادثة المستهدفة</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors rtl:rotate-180" />
        </Link>
      </div>

    </div>
  );
}
