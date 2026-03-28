"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/core/store/user-store";
import { X, BookOpen, CheckCircle2, ChevronUp } from "lucide-react";

export default function ComprehensibleReaderPage() {
  const router = useRouter();
  const { addXp } = useUserStore();
  
  const [comprehension, setComprehension] = useState<number>(50);
  const [isFinishing, setIsFinishing] = useState(false);

  const mockStory = {
    title: "مفتاح النجاح (The Key to Success)",
    level: "A2 - B1",
    content: [
      "في مدينة ضخمة تعج بالحركة، عاش شاب يُدعى 'عمر'. كان عمر يحلم دائماً بأن يصبح مبرمجاً محترفاً، لكنه كان يعتقد أن الأمر معقد جداً.",
      "كل يوم، كان يذهب إلى مكتبته الصغيرة، يفتح حاسوبه ويبدأ في قراءة الأكواد. في البداية، كانت تبدو وكأنها لغة أجنبية غير مفهومة. الأسئلة كانت تتكاثر في رأسه: من أين أبدأ؟ وكيف أتذكر كل هذه الأساسيات؟",
      "قرر عمر اتباع طريقة 'النسبة القليلة المستمرة'. بدأ بدراسة 20 دقيقة فقط كل يوم. لم يكن يحاول حفظ كل شيء، بل كان يحاول 'فهم' المنطق وراء الأكواد. مع مرور الوقت، وتكرار المفاهيم يوماً بعد يوم، بدأت القطع المتناثرة تتجمع في عقله كأنها لوحة فنية.",
      "بعد ستة أشهر من الالتزام اليومي، بنى عمر تطبيقه الأول بنجاح. أدرك حينها أن السر لا يكمن في الموهبة المفاجئة، بل في الاستمرارية وعدم الاستسلام للإحباط في البدايات."
    ]
  };

  const handleFinish = () => {
    setIsFinishing(true);
    
    // XP Calculation: base 10 XP + up to 15 bonus XP based on comprehension slider
    const earnedXp = 10 + Math.floor((comprehension / 100) * 15);
    addXp(earnedXp);

    setTimeout(() => {
      // Route to summary page with dummy stats to show the gamification loop
      router.push(`/summary?new=5&reviewed=12`);
    }, 600);
  };

  // Compute slider fill color and label based on value
  const getComprehensionDetails = () => {
    if (comprehension < 30) return { label: "صعب جداً", color: "text-red-400" };
    if (comprehension < 70) return { label: "فهمت الفكرة العامة", color: "text-orange-400" };
    if (comprehension < 95) return { label: "فهمت معظمه", color: "text-accent" };
    return { label: "مفهوم تماماً!", color: "text-green-400" };
  };

  const details = getComprehensionDetails();

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
          <BookOpen className="w-5 h-5 text-accent" />
          <h2 className="text-white text-base font-bold tracking-tight">
            قارئ الإدخال المفهوم
          </h2>
        </div>
        <div className="w-10"></div> {/* Spacer to center title */}
      </div>

      {/* Reader Content Container */}
      <div className="flex-1 w-full max-w-xl mx-auto px-6 pt-8 pb-48 relative">
        <header className="mb-10 text-center">
          <p className="text-accent text-sm font-bold uppercase tracking-widest mb-3">مستوى {mockStory.level}</p>
          <h1 className="text-3xl md:text-4xl font-black leading-tight text-white/90">
            {mockStory.title}
          </h1>
          <div className="w-16 h-1 bg-accent/50 mx-auto mt-6 rounded-full"></div>
        </header>

        <div className="space-y-8">
          {mockStory.content.map((paragraph, idx) => (
            <p 
              key={idx} 
              className="text-gray-300 text-lg md:text-xl font-medium leading-[2.2] tracking-wide text-justify"
              style={{ wordSpacing: '0.1rem' }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Actions Container */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/95 to-transparent pt-12 pb-6 px-4">
        <div className="w-full max-w-xl mx-auto bg-[#1a1a1a] border border-gray-800 rounded-3xl p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Subtle Glow inside the card */}
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-accent/5 blur-[50px] rounded-full pointer-events-none" />

          {/* Slider Header */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-white font-bold text-sm">قيّم مدى فهمك للنص</p>
              <p className={`text-xs font-bold mt-1 transition-colors ${details.color}`}>
                {details.label}
              </p>
            </div>
            <div className="text-2xl font-black text-accent drop-shadow-[0_0_8px_rgba(250,250,51,0.5)]">
              {comprehension}%
            </div>
          </div>

          {/* Custom Range Slider */}
          <div className="relative w-full h-12 flex items-center group mb-6">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={comprehension}
              onChange={(e) => setComprehension(Number(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Track Background */}
            <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-gray-800 shadow-inner relative">
              {/* Active Fill */}
              <div 
                className="absolute top-0 right-0 h-full bg-accent transition-all duration-75 ease-out shadow-[0_0_15px_rgba(250,250,51,0.6)]"
                style={{ width: `${comprehension}%` }}
              ></div>
            </div>
            
            {/* Custom Thumb (Visual only, tracks with the value) */}
            <div 
              className="absolute w-6 h-6 bg-white border-2 border-accent rounded-full shadow-[0_0_10px_rgba(250,250,51,0.5)] transition-all duration-75 ease-out flex items-center justify-center pointer-events-none"
              style={{ right: `calc(${comprehension}% - ${12 * (comprehension/100)}px)` }}
            >
              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleFinish}
            disabled={isFinishing}
            className="w-full flex justify-center items-center gap-2 h-14 bg-accent text-black font-black text-lg rounded-xl shadow-[0_0_20px_rgba(250,250,51,0.3)] hover:shadow-[0_0_30px_rgba(250,250,51,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none relative overflow-hidden group"
          >
            {isFinishing ? (
              <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6 mr-1" />
                <span>إنهاء الجلسة وحفظ الـ XP</span>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_forwards] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
              </>
            )}
          </button>

        </div>
      </div>

    </main>
  );
}
