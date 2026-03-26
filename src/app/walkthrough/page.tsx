"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Settings, AlignVerticalSpaceAround, BookOpen, Brain, Mic } from "lucide-react";

const slides = [
  {
    id: "95-rule",
    title: "قاعدة الـ 95%:",
    subtitle: "منطقة الاكتساب الأمثل",
    description: "تعلم من خلال محتوى تفهمه بنسبة 95% على الأقل لضمان التقدم المستمر",
    Visual: () => (
      <div className="w-full relative group">
        <div className="bg-surface rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden border border-gray-800">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
          <div className="w-full space-y-8 relative z-10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-gray-400">صعب جداً</span>
              <span className="text-2xl font-bold text-accent">95% - 98%</span>
              <span className="text-sm text-gray-400">سهل جداً</span>
            </div>
            <div className="h-4 w-full bg-gray-900 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-50" />
              <div className="absolute right-0 top-0 h-full w-[95%] bg-gradient-to-l from-accent to-yellow-600 rounded-full shadow-[0_0_20px_rgba(250,250,51,0.3)]" />
              <div className="absolute right-[95%] top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-4 border-yellow-600 shadow-xl transition-all duration-500" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-4">
              <div className="p-3 bg-black/40 rounded-lg">
                <span className="block text-xs text-gray-500 mb-1">الإحباط</span>
                <span className="text-red-400 font-bold">80%</span>
              </div>
              <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg scale-110 shadow-[0_0_15px_rgba(250,250,51,0.2)]">
                <span className="block text-xs text-accent mb-1">النمو</span>
                <span className="text-accent font-bold">95%</span>
              </div>
              <div className="p-3 bg-black/40 rounded-lg">
                <span className="block text-xs text-gray-500 mb-1">الملل</span>
                <span className="text-white font-bold">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "active-recall",
    title: "التكرار المتباعد:",
    subtitle: "السر وراء الذاكرة الحديدية",
    description: "نظام ذكي يحدد الوقت المثالي لمراجعة الكلمات قبل نسيانها.",
    Visual: () => (
      <div className="relative w-full aspect-square flex items-center justify-center max-w-[320px] mx-auto my-8">
        <div className="absolute inset-0 bg-accent opacity-5 blur-[100px] rounded-full" />
        <div className="relative z-10 w-full h-full gap-4 p-4 flex justify-center items-center">
          <div className="absolute w-40 h-40 bg-surface rounded-xl flex flex-col items-center justify-center p-8 border border-gray-800 rotate-[-6deg] shadow-[0_0_20px_rgba(250,250,51,0.15)] z-20">
            <AlignVerticalSpaceAround className="text-accent w-16 h-16 mb-4" />
            <div className="h-2 w-16 bg-accent/20 rounded-full" />
          </div>
          <div className="absolute -right-4 top-10 w-24 h-24 bg-accent rounded-xl flex items-center justify-center rotate-[12deg] shadow-2xl z-30">
            <BookOpen className="text-black w-10 h-10" />
          </div>
          <div className="absolute -left-6 bottom-4 w-20 h-20 bg-gray-900 rounded-xl flex items-center justify-center rotate-[-15deg] border border-gray-800 z-10">
            <Brain className="text-yellow-600 w-8 h-8" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: "shadowing",
    title: "التظليل (Shadowing):",
    subtitle: "تحدث كالأصليين",
    description: "حاكي نبرة المتحدثين الأصليين لتحسين النطق والإيقاع الصوتي.",
    Visual: () => (
      <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center mx-auto my-8">
        <div className="absolute inset-0 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative z-10 w-full h-full bg-surface rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden border border-gray-800">
          <div className="flex items-end justify-center space-x-reverse space-x-2 h-32 mb-8">
            <div className="w-1.5 h-12 bg-accent opacity-40 rounded-full" />
            <div className="w-1.5 h-20 bg-accent opacity-60 rounded-full" />
            <div className="w-1.5 h-32 bg-accent opacity-100 rounded-full shadow-[0_0_15px_rgba(250,250,51,0.5)]" />
            <div className="w-1.5 h-24 bg-accent opacity-80 rounded-full" />
            <div className="w-1.5 h-16 bg-accent opacity-50 rounded-full" />
            <div className="w-1.5 h-28 bg-accent opacity-90 rounded-full shadow-[0_0_15px_rgba(250,250,51,0.5)]" />
            <div className="w-1.5 h-14 bg-accent opacity-40 rounded-full" />
          </div>
          <div className="absolute -top-4 right-8 p-6 bg-accent rounded-xl text-black shadow-[0_8px_32px_rgba(250,250,51,0.3)] transform -rotate-6">
            <Mic className="w-8 h-8" />
          </div>
        </div>
      </div>
    )
  }
];

export default function WalkthroughScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      router.push("/login");
    }
  };

  const handleSkip = () => {
    router.push("/login");
  };

  const slide = slides[step];

  return (
    <main className="bg-background text-white min-h-screen flex flex-col overflow-hidden selection:bg-accent selection:text-black">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50">
        <div className="flex flex-row-reverse justify-between items-center w-full px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-accent font-sans">دلتا ليب</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:bg-surface transition-colors p-2 text-accent rounded-full active:scale-95 duration-150">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 pt-24 pb-12 w-full max-w-lg mx-auto">
        <div className="w-full flex-grow flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500" key={step}>
          {/* Header Title */}
          <div className="text-right space-y-4 mb-10 w-full">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-accent">
              {slide.title} <br/>
              <span className="text-white">{slide.subtitle}</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-md ml-auto">
              {slide.description}
            </p>
          </div>

          {/* Visual Component */}
          <slide.Visual />
        </div>

        {/* Progress & Navigation */}
        <div className="w-full mt-auto pt-8 flex flex-col items-center gap-6">
          {/* Navigation Dots */}
          <div className="flex flex-row-reverse gap-3">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-2.5 rounded-full transition-all duration-300 ${i === step ? 'w-10 bg-accent shadow-[0_0_10px_rgba(250,250,51,0.5)]' : 'w-2.5 bg-gray-800'}`} 
              />
            ))}
          </div>

          {/* Primary Action Button */}
          <button 
            onClick={handleNext}
            className="w-full py-5 bg-gradient-to-tr from-accent to-yellow-500 text-black text-lg font-bold rounded-xl active:scale-[0.98] transition-all duration-150 shadow-[0_12px_40px_rgba(250,250,51,0.15)] flex items-center justify-center group"
          >
            <span>{step === slides.length - 1 ? 'إنهاء الجولة' : 'التالي'}</span>
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Skip Button */}
          {step < slides.length - 1 && (
            <button 
              onClick={handleSkip}
              className="py-2 text-gray-500 hover:text-accent transition-colors font-medium"
            >
              تخطي الجولة
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
