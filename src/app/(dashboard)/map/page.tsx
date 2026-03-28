"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/core/store/user-store";
import { wordsRepo } from "@/core/services/words-repo";
import { useEffect, useState } from "react";
import { Play, BookOpen, Mic, MessageSquare, Trophy, ChevronLeft, Flame, Zap } from "lucide-react";
import Link from "next/link";

const LEARNING_PATHS = [
  {
    id: "flashcards",
    title: "جلسة البطاقات",
    subtitle: "تعلم ومراجعة المفردات",
    href: "/session",
    icon: <BookOpen className="w-6 h-6" />,
    color: "from-accent to-yellow-600",
    glowColor: "rgba(250,250,51,0.3)",
    isPrimary: true,
  },
  {
    id: "review",
    title: "مراجعة المستحق",
    subtitle: "راجع الكلمات قبل نسيانها",
    href: "/session?mode=review&limit=10",
    icon: <Zap className="w-6 h-6" />,
    color: "from-purple-500 to-violet-600",
    glowColor: "rgba(168,85,247,0.3)",
    isPrimary: true,
  },
  {
    id: "reader",
    title: "القارئ المفهوم",
    subtitle: "تدرب على الفهم القرائي",
    href: "/reader",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-emerald-500 to-green-600",
    glowColor: "rgba(16,185,129,0.2)",
    isPrimary: false,
  },
  {
    id: "shadowing",
    title: "مختبر التظليل",
    subtitle: "قارن نطقك بالأصلي",
    href: "/shadowing",
    icon: <Mic className="w-5 h-5" />,
    color: "from-red-500 to-rose-600",
    glowColor: "rgba(239,68,68,0.2)",
    isPrimary: false,
  },
  {
    id: "tutor",
    title: "المعلم الذكي",
    subtitle: "تدرب على المحادثة",
    href: "/tutor",
    icon: <MessageSquare className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-600",
    glowColor: "rgba(59,130,246,0.2)",
    isPrimary: false,
  },
];

export default function LearningMapPage() {
  const router = useRouter();
  const { xp, level, streak, targetLevel } = useUserStore();
  const [learnedCount, setLearnedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    wordsRepo.getLearnedWordsCount().then(setLearnedCount);
  }, []);

  if (!mounted) return null;

  const masteryPercent = Math.min(100, Math.floor((learnedCount / 3000) * 100));

  return (
    <div className="flex-1 flex flex-col items-center w-full px-4 pt-8 pb-24 animate-in fade-in duration-500 overflow-y-auto" dir="rtl">

      {/* Header */}
      <header className="w-full max-w-2xl flex flex-row-reverse items-center justify-between mb-6">
        <div className="flex flex-col text-right">
          <h1 className="text-white text-xl font-bold tracking-tight">خريطة التعلم</h1>
          <span className="text-xs text-gray-400 mt-0.5">اختر مسار التدريب</span>
        </div>
        <div className="flex flex-row-reverse gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <Flame className="w-4 h-4 text-accent fill-accent/20" />
            <span className="text-accent text-sm font-bold">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-bold" dir="ltr">Lvl {level}</span>
          </div>
        </div>
      </header>

      {/* Progress Overview Card */}
      <div className="w-full max-w-2xl mb-8">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="flex flex-row-reverse items-center justify-between mb-3">
            <div className="text-right">
              <p className="text-white font-bold text-sm">رحلة أوكسفورد 3000</p>
              <p className="text-gray-400 text-xs mt-1">المستوى الحالي: {targetLevel}</p>
            </div>
            <span className="text-accent text-2xl font-black" dir="ltr">{masteryPercent}%</span>
          </div>

          <div className="h-2.5 w-full bg-black rounded-full overflow-hidden border border-gray-800">
            <div
              className="h-full bg-gradient-to-l from-accent to-yellow-600 transition-all duration-1000 shadow-[0_0_10px_rgba(250,250,51,0.5)]"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
          <div className="flex flex-row-reverse justify-between mt-2">
            <span className="text-[10px] text-gray-500">{learnedCount} كلمة متعلمة</span>
            <span className="text-[10px] text-gray-500">{xp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="w-full max-w-2xl flex flex-col gap-4 mb-8">
        <h3 className="text-white text-sm font-bold pr-1">ابدأ جلسة</h3>
        {LEARNING_PATHS.filter(p => p.isPrimary).map((path) => (
          <Link key={path.id} href={path.href}>
            <div 
              className="group relative rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ boxShadow: `0 0 25px ${path.glowColor}` }}
            >
              <div className={`bg-gradient-to-l ${path.color} p-5 flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center text-white">
                    {path.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{path.title}</h4>
                    <p className="text-white/70 text-xs mt-0.5">{path.subtitle}</p>
                  </div>
                </div>
                <ChevronLeft className="w-6 h-6 text-white/60 group-hover:text-white group-hover:-translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Secondary Learning Engines */}
      <div className="w-full max-w-2xl flex flex-col gap-3 mb-8">
        <h3 className="text-white text-sm font-bold pr-1">محركات التعلم الإضافية</h3>
        {LEARNING_PATHS.filter(p => !p.isPrimary).map((path) => (
          <Link key={path.id} href={path.href}>
            <div className="group rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${path.color} bg-opacity-20 flex items-center justify-center text-white`}>
                  {path.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold">{path.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{path.subtitle}</p>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Choose Level */}
      <div className="w-full max-w-2xl">
        <Link href="/levels">
          <div className="group rounded-2xl bg-accent/5 border border-accent/20 p-4 flex items-center justify-between hover:bg-accent/10 transition-all">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="text-accent font-bold">تغيير المستوى</h4>
                <p className="text-xs text-gray-400 mt-0.5">الحالي: {targetLevel} — اختر مستوى آخر</p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-accent/50 group-hover:text-accent transition-colors" />
          </div>
        </Link>
      </div>

    </div>
  );
}
