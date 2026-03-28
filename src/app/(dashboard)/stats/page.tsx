"use client";

import { useUserStore } from "@/core/store/user-store";
import { wordsRepo } from "@/core/services/words-repo";
import { useEffect, useState } from "react";
import { BarChart2, Flame, BookOpen, Brain, TrendingUp, Target, Clock, Award, Zap } from "lucide-react";

export default function StatsPage() {
  const {
    xp, level, nextLevelXp, streak,
    dailyGoal, xpToday, focusHours, efficiencyScore,
    milestones
  } = useUserStore();

  const [learnedCount, setLearnedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    wordsRepo.getLearnedWordsCount().then(setLearnedCount);
  }, []);

  if (!mounted) return null;

  const levelProgress = Math.min(100, Math.max(0, Math.floor((xp / nextLevelXp) * 100)));
  const dailyProgress = Math.min(100, Math.max(0, Math.floor((xpToday / dailyGoal) * 100)));
  const masteryPercent = Math.min(100, Math.max(0, Math.floor((learnedCount / 3000) * 100)));

  const statCards = [
    {
      label: "إجمالي نقاط XP",
      value: xp.toLocaleString(),
      icon: <Zap className="w-5 h-5" />,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
    {
      label: "المستوى الحالي",
      value: `Lvl ${level}`,
      icon: <Award className="w-5 h-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      label: "أيام الحماس المتتالية",
      value: `${streak} يوم`,
      icon: <Flame className="w-5 h-5" />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      label: "ساعات التركيز",
      value: `${focusHours.toFixed(1)} h`,
      icon: <Clock className="w-5 h-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "الكلمات المتعلمة",
      value: `${learnedCount} / 3000`,
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      label: "الكفاءة",
      value: `+${efficiencyScore.toFixed(1)}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center w-full px-4 pt-8 pb-24 animate-in fade-in duration-500 overflow-y-auto" dir="rtl">

      {/* Header */}
      <header className="w-full max-w-2xl flex flex-row-reverse items-center justify-between mb-8">
        <div className="flex flex-row-reverse items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-accent" />
          </div>
          <div className="flex flex-col text-right">
            <h1 className="text-white text-xl font-bold tracking-tight">الإحصائيات</h1>
            <span className="text-xs text-gray-400 mt-0.5">تتبع تقدمك الكامل</span>
          </div>
        </div>
      </header>

      {/* Level Progress Section */}
      <div className="w-full max-w-2xl mb-8">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="flex flex-row-reverse items-center justify-between mb-4">
            <div className="text-right">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">التقدم نحو المستوى التالي</p>
              <p className="text-white text-3xl font-black" dir="ltr">Lvl {level}</p>
            </div>
            <div className="text-left">
              <p className="text-accent text-2xl font-bold" dir="ltr">{xp} <span className="text-sm text-gray-400">/ {nextLevelXp}</span></p>
              <p className="text-gray-500 text-xs">XP</p>
            </div>
          </div>

          <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-gray-800">
            <div
              className="h-full bg-gradient-to-l from-accent to-yellow-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(250,250,51,0.5)]"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <p className="text-gray-500 text-[11px] mt-2 text-center">{levelProgress}% مکتمل</p>
        </div>
      </div>

      {/* Daily Goal Section */}
      <div className="w-full max-w-2xl mb-8">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5">
          <div className="flex flex-row-reverse items-center justify-between mb-3">
            <div className="flex flex-row-reverse items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              <span className="text-white font-bold text-sm">الهدف اليومي</span>
            </div>
            <span className="text-accent font-bold text-sm" dir="ltr">{xpToday} / {dailyGoal} XP</span>
          </div>
          <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-gray-800">
            <div
              className="h-full bg-accent transition-all duration-700 rounded-full shadow-[0_0_8px_rgba(250,250,51,0.4)]"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
          <p className="text-gray-500 text-[11px] mt-2 text-center">
            {dailyProgress >= 100 ? "🎉 أحسنت! وصلت لهدفك اليومي" : `${dailyProgress}% من هدف اليوم`}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className={`${card.bgColor} border ${card.borderColor} rounded-xl p-4 flex flex-col gap-2`}>
            <div className={`flex flex-row-reverse items-center gap-2 ${card.color} mb-1`}>
              {card.icon}
              <span className="text-[11px] uppercase font-medium tracking-wide">{card.label}</span>
            </div>
            <p className="text-2xl font-black text-white" dir="ltr">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Mastery Progress */}
      <div className="w-full max-w-2xl mb-8">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5">
          <div className="flex flex-row-reverse items-center justify-between mb-3">
            <div className="flex flex-row-reverse items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-white font-bold text-sm">إتقان أوكسفورد 3000</span>
            </div>
            <span className="text-purple-400 font-bold text-sm" dir="ltr">{masteryPercent}%</span>
          </div>
          <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-gray-800">
            <div
              className="h-full bg-gradient-to-l from-purple-500 to-blue-500 transition-all duration-700 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.4)]"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
          <p className="text-gray-500 text-[11px] mt-2 text-center">{learnedCount} كلمة من 3000 كلمة</p>
        </div>
      </div>

      {/* Milestones Summary */}
      <div className="w-full max-w-2xl">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5">
          <div className="flex flex-row-reverse items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-accent" />
            <span className="text-white font-bold text-sm">الإنجازات المفتوحة</span>
          </div>
          <p className="text-4xl font-black text-accent text-center py-4 drop-shadow-[0_0_10px_rgba(250,250,51,0.3)]">
            {milestones.length}
          </p>
          <p className="text-gray-500 text-xs text-center">من أصل 5 إنجازات متاحة</p>
        </div>
      </div>

    </div>
  );
}
