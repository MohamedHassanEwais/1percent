"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Lock, AtSign, LogIn, Chrome, Apple } from "lucide-react";

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth and route to target language selection
    router.push("/onboarding/target-language");
  };

  return (
    <main className="min-h-screen bg-background text-white flex items-center justify-center p-6 md:p-12 relative overflow-hidden selection:bg-accent selection:text-black">
      {/* Background Asymmetric Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Right Side: Hero Narrative (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col space-y-8 pr-8">
          <div className="space-y-4 text-right rtl">
            <span className="text-accent font-black text-4xl tracking-tighter uppercase block">Delta Leap</span>
            <h1 className="text-6xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg">
              أتقن اللغة<br />بقفزة ذكية
            </h1>
            <p className="text-gray-400 text-xl leading-relaxed max-w-md">
              انضم إلى مجتمع "نيون سكولار" حيث يلتقي التركيز العميق مع الطاقة الذهنية المتجددة.
            </p>
          </div>

          {/* Feature Visual (Bento-style Minimalist Card) */}
          <div className="bg-surface/50 backdrop-blur-md p-8 rounded-xl relative overflow-hidden group border border-gray-800">
            <div className="absolute top-0 right-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-all duration-500" />
            <div className="flex flex-row-reverse items-center justify-end gap-4 mb-6">
              <div className="text-white font-bold text-lg">تعلم مدعوم بالذكاء الاصطناعي</div>
              <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-accent shadow-inner">
                <Brain className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-l from-accent to-yellow-600 shadow-[0_0_15px_rgba(250,250,51,0.5)]" />
              </div>
              <div className="flex flex-row-reverse justify-between text-xs text-gray-400 font-medium">
                <span>التقدم اليومي</span>
                <span className="text-accent font-bold text-[14px]">75%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Auth Form */}
        <div className="bg-surface/80 backdrop-blur-xl p-8 md:p-12 rounded-xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-gray-800 relative z-20">
          <div className="flex flex-col space-y-8 rtl">
            
            <div className="md:hidden flex flex-col items-center justify-center mb-4">
              <span className="text-accent font-black text-3xl tracking-tighter uppercase drop-shadow-md">Delta Leap</span>
            </div>

            {/* Toggle Strategy */}
            <div className="flex bg-gray-900 p-1 rounded-lg">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 text-sm font-bold rounded-md transition-all ${isLogin ? 'bg-surface text-accent shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
              >
                تسجيل الدخول
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 text-sm font-bold rounded-md transition-all ${!isLogin ? 'bg-surface text-accent shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
              >
                إنشاء حساب
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Field: Email */}
              <div className="space-y-2 text-right">
                <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase px-1">البريد الإلكتروني</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    required
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-4 px-12 text-white placeholder:text-gray-600 focus:ring-0 focus:outline-none focus:border-accent focus:bg-gray-800 transition-all text-right dir-rtl" 
                    placeholder="name@example.com" 
                  />
                  <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Input Field: Password */}
              <div className="space-y-2 text-right">
                <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase px-1">كلمة المرور</label>
                <div className="relative group">
                  <input 
                    type="password" 
                    required
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-4 px-12 text-white placeholder:text-gray-600 focus:ring-0 focus:outline-none focus:border-accent focus:bg-gray-800 transition-all text-right dir-rtl" 
                    placeholder="••••••••" 
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {isLogin && (
                <div className="flex flex-row-reverse items-center justify-between text-sm">
                  <label className="flex flex-row-reverse items-center justify-end gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-accent focus:ring-accent focus:ring-offset-background" />
                    <span className="text-gray-400 group-hover:text-gray-200 transition-colors select-none">تذكرني</span>
                  </label>
                  <a href="#" className="text-accent font-medium hover:text-yellow-400 hover:underline">نسيت كلمة المرور؟</a>
                </div>
              )}

              <div className="space-y-4 pt-4">
                <button type="submit" className="w-full py-4 rounded-lg bg-gradient-to-l from-accent to-yellow-500 text-black font-black text-lg active:scale-[0.98] hover:scale-[1.01] transition-all flex flex-row-reverse items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,250,51,0.25)]">
                  <span>{isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}</span>
                  <LogIn className="w-5 h-5 rotate-180" />
                </button>

                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-gray-800" />
                  <span className="flex-shrink mx-4 text-xs font-bold text-gray-500 uppercase tracking-widest">أو عبر</span>
                  <div className="flex-grow border-t border-gray-800" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="flex flex-row-reverse items-center justify-center gap-3 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors active:scale-95 duration-150 border border-gray-800">
                    <Chrome className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-bold">جوجل</span>
                  </button>
                  <button type="button" className="flex flex-row-reverse items-center justify-center gap-3 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors active:scale-95 duration-150 border border-gray-800">
                    <Apple className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-bold">آبل</span>
                  </button>
                </div>
              </div>
            </form>

            <p className="text-center text-gray-500 text-xs pt-8 leading-relaxed max-w-sm mx-auto">
              باستمرارك، أنت توافق على <a href="#" className="text-accent tracking-wide hover:underline">شروط الخدمة</a> و <a href="#" className="text-accent tracking-wide hover:underline">سياسة الخصوصية</a> الخاصة بـ Delta Leap.
            </p>
          </div>
        </div>
      </div>

      {/* Branding Element: Top Corner */}
      <div className="fixed top-8 left-8 hidden md:block z-50 pointer-events-none">
        <div className="flex flex-row-reverse items-center justify-end gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-black font-black text-xl italic shadow-lg">Δ</div>
          <div className="text-white font-black tracking-widest text-xs uppercase opacity-40">Scholar System v4.0</div>
        </div>
      </div>
    </main>
  );
}
