"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Brain, Rocket, ArrowLeft, BarChart2, CheckCircle2, HelpCircle, Menu, Settings } from "lucide-react";
import Image from "next/image";

type PlacementStep = 'intro' | 'question' | 'result';

export default function PlacementTestFlow() {
  const router = useRouter();
  const [step, setStep] = useState<PlacementStep>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleStartTest = () => setStep('question');
  
  const handleCheckAnswer = () => {
    if (selectedAnswer) {
      setStep('result');
    }
  };

  const handleFinish = () => {
    // Navigate to the main app dashboard
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-background text-white font-sans selection:bg-accent selection:text-black overflow-x-hidden">
      
      {step === 'intro' && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-24 max-w-6xl mx-auto animate-in fade-in zoom-in duration-500">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left/Top Content */}
            <div className="lg:col-span-7 space-y-8 order-2 lg:order-1 rtl text-right">
              <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-900/30 text-accent text-sm font-medium tracking-wide">
                  <Zap className="w-4 h-4" />
                  <span>Delta Leap Intelligence</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white leading-tight">
                  اختبار تحديد المستوى
                </h1>
                <p className="text-xl lg:text-2xl text-gray-400 font-medium max-w-xl leading-relaxed ml-auto">
                  نستخدم خوارزميات متطورة لتحديد نقطة <span className="text-accent font-bold tracking-widest italic">i+1</span> الخاصة بك، لضمان تعلم فعال وممتع.
                </p>
              </header>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 space-y-3">
                    <Brain className="text-accent w-8 h-8" />
                    <h3 className="text-lg font-bold">تحدي ذكي</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">يتكيف الاختبار مع إجاباتك لحظياً لتقليل الوقت والجهد المبذول.</p>
                  </div>
                  <div className="p-6 rounded-xl bg-surface border border-gray-800 space-y-3">
                    <Rocket className="text-accent w-8 h-8" />
                    <h3 className="text-lg font-bold">منهجية i+1</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">نضعك في المستوى الذي يفوق معرفتك الحالية بخطوة واحدة فقط.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
                <button 
                  onClick={handleStartTest}
                  className="px-8 py-4 bg-gradient-to-l from-accent to-yellow-500 text-black font-black text-lg rounded-lg shadow-[0_0_20px_rgba(250,250,51,0.3)] active:scale-95 transition-all flex flex-row-reverse items-center justify-center gap-3"
                >
                  <span>ابدأ الاختبار الآن</span>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button className="px-8 py-4 bg-transparent text-accent border border-gray-700 font-bold text-lg rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center">
                  عرض المنهج
                </button>
              </div>
              
              <p className="text-xs text-gray-500 flex flex-row-reverse items-center justify-start gap-2">
                يستغرق الاختبار حوالي 8-12 دقيقة تقريباً
                <BarChart2 className="w-4 h-4 ml-1" />
              </p>
            </div>

            {/* Right/Bottom Visual Area */}
            <div className="lg:col-span-5 relative order-1 lg:order-2">
              <div className="relative aspect-square w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-accent/5 blur-[100px] rounded-full" />
                <div className="relative h-full w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-gray-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGYRK7VQpEJ2gq1IhTgk0fbeGNO9NTqA9HJGaDmJbS58eTPvO8JnCc0T0vhCmuh0L5Hej3EJvmpLxs9LfRlMCQ_yzXwrabpd4a-P0lFpeNmay3NpE039qo8oUgW6kdZLT1K_HonUCOyOsMmvO_z_3uBxQU5bn4WZGxCD3PL5McKwks8t5RpNeg6hQyzOoR3LCCzXz4w7UW9pfEhJRHZhbp5zWiT0B4-Q60yhI1cr5Y13TusavQ3BubohP59gDaCgU-tc5KJtcCzOU"
                    alt="Abstract neon light patterns"
                    className="w-full h-full object-cover grayscale opacity-60"
                  />
                  
                  {/* Overlay Glass Card */}
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-xl rounded-xl border border-gray-700 rtl text-right">
                    <div className="flex flex-row-reverse items-center justify-start gap-4 mb-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black">
                        <BarChart2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">الحالة الراهنة</p>
                        <p className="text-sm font-bold text-white">تحليل الكفاءة اللغوية</p>
                      </div>
                    </div>
                    {/* Progress Simulation */}
                    <div className="space-y-2">
                      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden flex justify-end">
                        <div className="h-full bg-accent w-3/4 shadow-[0_0_8px_rgba(250,250,51,0.6)]" />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-accent/80">
                        <span>متقدم</span>
                        <span>مبتدئ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-xl rotate-3">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black text-accent">100%</span>
                    <span className="text-[10px] uppercase tracking-tighter text-gray-400">دقة التحليل</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {step === 'question' && (
        <div className="min-h-screen flex flex-col animate-in slide-in-from-right duration-500 relative">
          {/* Top Navigation */}
          <nav className="fixed top-0 w-full z-50 bg-[#131313] shadow-md flex justify-between items-center px-6 py-4 h-16">
            <div className="flex items-center gap-4">
              <div className="h-2 w-32 md:w-48 bg-gray-800 rounded-full overflow-hidden flex justify-end">
                <div className="h-full bg-accent w-[65%] shadow-[0_0_10px_rgba(250,250,51,0.5)] transition-all duration-500" />
              </div>
              <span className="text-xs font-bold text-accent tracking-tight">12/18</span>
            </div>
            <div className="text-2xl font-black text-accent tracking-tighter uppercase hidden sm:block">Delta Leap</div>
            <div className="flex items-center gap-2">
              <Zap className="text-accent w-5 h-5 fill-accent" />
              <span className="font-bold text-sm">450</span>
            </div>
          </nav>

          <main className="flex-grow pt-24 pb-32 px-6 max-w-3xl mx-auto w-full rtl text-right">
            <section className="mb-12">
              <div className="flex items-center justify-start gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-yellow-900/30 text-accent text-[10px] font-bold tracking-widest uppercase border border-accent/20">المستوى المتوسط</span>
                <span className="text-gray-400 text-sm font-medium">اختر الإجابة الصحيحة</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight mb-8">
                ما هو المعنى الدقيق لكلمة <span className="text-accent italic underline decoration-2 underline-offset-8">"الاستدامة"</span> في سياق الحفاظ على البيئة؟
              </h1>
              <div className="rounded-xl overflow-hidden mb-12 shadow-2xl border border-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6jepDYoL4hd7-iy5StVHiMRpKN04LI_2jzxE_2VwTtchhzM6slc5e-avZcmyPRD3o3pfIPPm2WeqVXjKQg2lOMPsTaWx1XGnbflpEQpY6jRDK-vi-YqL6tW7NUXhuzpSyYREa2kL7SqNCpfLokEJcvFgQnqrqP9P3Nv8ymcgm4P90j-LpheoXJr5t5suqIqn16sY_0s68crAY_xO3TDiLn0bkdlJjAV_H2hTbUV7CZqS0TRAc76EJdC272eSf8ZhED6fDE4QCo1A"
                  className="w-full h-48 md:h-64 object-cover opacity-80 mix-blend-luminosity"
                  alt="Sustainability Context"
                />
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'a', char: 'أ', text: 'القدرة على الاستهلاك السريع للموارد' },
                { id: 'b', char: 'ب', text: 'تلبية احتياجات الحاضر دون المساس بقدرة الأجيال القادمة' },
                { id: 'c', char: 'ج', text: 'التركيز فقط على التطور الصناعي والتقني' },
                { id: 'd', char: 'د', text: 'زيادة الإنتاج المحلي بأي ثمن ممكن' }
              ].map(opt => {
                const isSelected = selectedAnswer === opt.id;
                return (
                  <button 
                    key={opt.id}
                    onClick={() => setSelectedAnswer(opt.id)}
                    className={`group relative flex items-center justify-start p-6 rounded-xl transition-all duration-300 text-right active:scale-[0.98] border
                      ${isSelected 
                        ? 'bg-gray-800 border-accent shadow-[0_0_15px_rgba(250,250,51,0.2)]'
                        : 'bg-surface border-gray-800 hover:bg-gray-800'}
                    `}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-black transition-colors ml-4
                      ${isSelected ? 'bg-accent text-black' : 'bg-gray-900 text-gray-400 group-hover:text-accent'}
                    `}>
                      {opt.char}
                    </div>
                    <div className="flex-1">
                      <p className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{opt.text}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute left-6 text-accent animate-in zoom-in duration-200">
                        <CheckCircle2 className="w-6 h-6 fill-accent text-black" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </main>

          {/* Bottom Action Shell */}
          <div className="fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-md border-t border-gray-800 z-50">
            <div className="max-w-3xl mx-auto px-6 py-4 flex flex-row-reverse items-center justify-between gap-6">
              <button className="flex flex-row-reverse items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold">
                <HelpCircle className="w-5 h-5" />
                <span>تلميح</span>
              </button>
              <div className="flex flex-row-reverse gap-4 items-center">
                <button className="hidden md:flex px-8 py-4 font-black text-gray-400 hover:text-white transition-all">تخطي</button>
                <button 
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className={`px-12 py-4 rounded-xl font-black text-lg transition-all ${
                    selectedAnswer 
                      ? 'bg-gradient-to-l from-accent to-yellow-500 text-black shadow-[0_0_20px_rgba(250,250,51,0.3)] hover:scale-[1.02] active:scale-95 cursor-pointer'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  التحقق من الإجابة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="min-h-screen flex flex-col pt-24 pb-32 px-6 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500 relative">
          {/* Header */}
          <header className="fixed top-0 left-0 w-full z-50 bg-[#131313] h-16 flex justify-between items-center px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black text-accent tracking-tighter uppercase">Delta Leap</h1>
            </div>
            <button className="text-accent active:scale-95 duration-150">
              <Settings className="w-6 h-6" />
            </button>
          </header>

          <section className="w-full text-right mb-12 rtl">
            <h2 className="text-5xl font-black mb-2 tracking-tight">نتيجتك</h2>
            <p className="text-gray-400 text-lg max-w-md">لقد أكملت تقييم المستوى بنجاح. إليك مستوى إتقانك الحالي.</p>
          </section>

          <div className="relative w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-16 rtl">
            {/* Visual Badge */}
            <div className="md:col-span-7 flex justify-center md:justify-start">
              <div className="relative group">
                <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full" />
                <div className="relative bg-gray-900 p-12 rounded-[2rem] shadow-[0_0_40px_rgba(250,250,51,0.15)] flex flex-col items-center justify-center border border-gray-800">
                  <span className="text-accent font-black text-9xl tracking-tighter leading-none mb-4 drop-shadow-[0_0_20px_rgba(250,250,51,0.5)]">i+1</span>
                  <div className="h-1.5 w-32 bg-accent rounded-full shadow-[0_0_12px_rgba(250,250,51,0.6)]" />
                  <p className="mt-6 text-white font-bold text-xl tracking-wide uppercase">Advanced Beginner</p>
                </div>
                <div className="absolute -top-6 -right-6 bg-surface p-4 rounded-xl shadow-2xl border border-gray-700">
                  <CheckCircle2 className="text-accent w-10 h-10 fill-accent/20" />
                </div>
              </div>
            </div>

            {/* Level Stats */}
            <div className="md:col-span-5 text-right flex flex-col gap-6">
              <div className="bg-surface p-6 rounded-xl border-r-4 border-accent shadow-lg">
                <h3 className="text-accent font-bold text-lg mb-2">ماذا يعني هذا؟</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  أنت الآن في مرحلة "i+1". هذا يعني أنك مستعد لاستيعاب المحتوى الذي يتجاوز مستواك الحالي بقليل، مما يضمن أسرع مسار لاكتساب اللغة بشكل طبيعي.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 pb-2 pt-4 px-4 rounded-lg border border-gray-800 flex flex-col items-center">
                  <div className="text-accent font-black text-3xl">85%</div>
                  <div className="text-sm text-gray-500 mt-1">فهم المسموع</div>
                </div>
                <div className="bg-gray-900 pb-2 pt-4 px-4 rounded-lg border border-gray-800 flex flex-col items-center">
                  <div className="text-accent font-black text-3xl">B1</div>
                  <div className="text-sm text-gray-500 mt-1">المستوى التقريبي</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-between bg-surface p-8 rounded-2xl border border-gray-800 shadow-xl rtl text-right">
            <div>
              <h4 className="text-xl font-bold mb-1 text-white">جاهز للقفزة القادمة؟</h4>
              <p className="text-gray-400">تم تخصيص المنهج بناءً على هذه النتائج.</p>
            </div>
            <button 
              onClick={handleFinish}
              className="bg-gradient-to-l from-accent to-yellow-500 text-black px-10 py-5 rounded-xl font-black text-lg tracking-tight hover:scale-105 active:scale-95 transition-all duration-200 flex flex-row-reverse items-center justify-center gap-3 shadow-[0_10px_30px_rgba(250,250,51,0.2)] group w-full md:w-auto"
            >
              <span>الاستمرار إلى المنصة</span>
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
