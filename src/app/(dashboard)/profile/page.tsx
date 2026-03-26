"use client";

import { useUserStore } from "@/core/store/user-store";
import { Share2, Settings, Zap, ArrowRight, ShieldCheck, Flame, Timer, BrainCircuit, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { xp, level, streak, nextLevelXp, user } = useUserStore();
    const router = useRouter();

    // Calculate progress percentage
    const progress = Math.min(100, (xp / nextLevelXp) * 100);
    // Hardcoded accuracy for now, will be dynamic later
    const accuracy = "98.5%";

    const handleResetDB = async () => {
        if (confirm("سيؤدي هذا إلى حذف قاعدة البيانات المحلية (الكلمات والمراجعات) لإصلاح المشاكل. هل تريد الاستمرار؟")) {
            const { db } = await import("@/core/db/dexie");
            await db.delete();
            window.location.reload();
        }
    };

    return (
        <main className="bg-black min-h-screen text-white font-sans overflow-x-hidden flex flex-col relative" dir="rtl">
            {/* Background Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen"></div>
            <div className="fixed top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="fixed bottom-0 left-0 w-80 h-80 bg-violet-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col flex-1 mx-auto w-full h-full pb-24">
                
                {/* Top App Bar */}
                <div className="flex items-center p-4 pb-2 justify-between">
                    <button onClick={() => router.push('/settings')} className="text-white/70 hover:text-accent transition-colors flex w-12 h-12 shrink-0 items-center justify-center rounded-full hover:bg-white/5 active:scale-95">
                        <Settings className="w-6 h-6" />
                    </button>
                    <h2 className="text-accent text-xs font-bold leading-tight uppercase tracking-widest flex-1 text-center">
                        هوية المتعلم
                    </h2>
                    <div className="flex w-12 items-center justify-end"></div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 px-4 pt-4 flex flex-col justify-start">
                    
                    {/* Futuristic ID Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-accent/30 w-full rounded-2xl overflow-hidden relative p-6 border-r-4 border-r-accent shadow-[0_0_30px_rgba(250,250,51,0.15)]">
                        
                        {/* Decorative tech lines */}
                        <div className="absolute top-4 left-4 flex gap-1 flex-row-reverse">
                            <div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-accent/50 rounded-full"></div>
                            <div className="w-1 h-1 bg-accent/20 rounded-full"></div>
                        </div>
                        
                        <div className="absolute bottom-4 right-4 text-[10px] text-white/20 font-mono tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                            ID: {user?.uid?.slice(0, 8).toUpperCase() || "DL-992-01"}
                        </div>

                        {/* Profile Header Section */}
                        <div className="flex flex-col items-center relative">
                            
                            {/* Avatar Container with Scanner Effect */}
                            <div className="relative mb-6 group cursor-pointer">
                                <div className="absolute -inset-1 bg-gradient-to-b from-accent to-transparent rounded-full opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative w-32 h-32 rounded-full p-1 bg-black/50 ring-1 ring-white/10 overflow-hidden">
                                    <div 
                                        className="w-full h-full rounded-full bg-center bg-cover bg-no-repeat" 
                                        style={{ backgroundImage: `url('${user?.photoURL || "https://i.pravatar.cc/150?img=33"}')` }}
                                    ></div>
                                    {/* Scanning line animation */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent w-full h-[20%] animate-[shimmer_3s_ease-in-out_infinite] top-0 pointer-events-none"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 bg-black border border-accent rounded-full p-1.5 flex items-center justify-center">
                                    <ShieldCheck className="text-accent w-4 h-4" />
                                </div>
                            </div>

                            <h1 className="text-white text-3xl font-bold leading-tight tracking-tight text-center mb-1">
                                {user?.displayName || "مستكشف اللغة"}
                            </h1>
                            
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent text-black uppercase tracking-wider">
                                    مستوى {level}
                                </span>
                                <p className="text-accent/80 text-sm font-medium tracking-wide">
                                    الرتبة: <span className="text-white font-bold ml-1">مبتدئ متقدم</span>
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="w-full grid grid-cols-2 gap-4 mb-8">
                                <div className="flex flex-col gap-1 rounded-xl p-4 bg-white/5 border border-white/10 hover:border-accent/50 transition-colors group">
                                    <div className="flex items-center gap-2 text-white/60 mb-1">
                                        <Zap className="w-5 h-5 group-hover:text-accent transition-colors" />
                                        <p className="text-xs font-medium uppercase tracking-wider">إجمالي النقاط</p>
                                    </div>
                                    <p className="text-white text-2xl font-bold leading-tight group-hover:text-accent group-hover:drop-shadow-[0_0_5px_rgba(250,250,51,0.5)] transition-all">
                                        {xp.toLocaleString()}
                                    </p>
                                </div>
                                
                                <div className="flex flex-col gap-1 rounded-xl p-4 bg-white/5 border border-white/10 hover:border-accent/50 transition-colors group">
                                    <div className="flex items-center gap-2 text-white/60 mb-1">
                                        <BrainCircuit className="w-5 h-5 group-hover:text-accent transition-colors" />
                                        <p className="text-xs font-medium uppercase tracking-wider">الدقة</p>
                                    </div>
                                    <p className="text-white text-2xl font-bold leading-tight group-hover:text-accent group-hover:drop-shadow-[0_0_5px_rgba(250,250,51,0.5)] transition-all">
                                        {accuracy}
                                    </p>
                                </div>
                            </div>

                            {/* Share Button (Holographic Effect) */}
                            <button className="relative overflow-hidden w-full max-w-[200px] flex mx-auto items-center justify-center gap-2 h-12 rounded-lg bg-gradient-to-r from-violet-900 to-violet-600 text-white font-bold tracking-wide shadow-lg border border-white/20 hover:scale-[1.02] active:scale-95 transition-all">
                                {/* Shine effect inside button */}
                                <div className="absolute inset-0 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent -rotate-45 -translate-x-full animate-[shimmer_3s_infinite]"></div>
                                <Share2 className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">مشاركة الهوية</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Badges */}
                    <div className="mt-8 px-2">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 pr-2">أحدث الشارات</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide rtl">
                            <div className="shrink-0 w-16 h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-accent/10 transition-colors shadow-lg">
                                <BrainCircuit className="text-accent w-8 h-8" />
                            </div>
                            <div className="shrink-0 w-16 h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-accent/10 transition-colors shadow-lg relative">
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-black"></div>
                                <Flame className="text-orange-500 w-8 h-8" />
                            </div>
                            <div className="shrink-0 w-16 h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-accent/10 transition-colors opacity-40 grayscale">
                                <Timer className="text-accent w-8 h-8" />
                            </div>
                            <div className="shrink-0 w-16 h-16 bg-white/5 rounded-lg border border-white/10 border-dashed flex items-center justify-center">
                                <span className="text-white/20 text-2xl font-light">+</span>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="mt-8 pt-6 border-t border-white/10 px-2 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-widest">منطقة الخطر (للمطورين)</h3>
                        </div>
                        <button
                            onClick={handleResetDB}
                            className="w-full py-3 rounded-lg border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-colors text-sm font-bold flex justify-center items-center gap-2"
                        >
                            تفريغ قاعدة البيانات المحلية
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
