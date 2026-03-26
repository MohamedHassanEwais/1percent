"use client";

import { useUserStore } from "@/core/store/user-store";
import { ChevronRight, Volume2, Bell, Moon, Lock, Info, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsPage() {
    const router = useRouter();
    const { clearUser } = useUserStore();
    
    // UI state for toggles
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [remindersEnabled, setRemindersEnabled] = useState(false);

    const handleLogout = () => {
        if (confirm("هل أنت متأكد من رغبتك في تسجيل الخروج؟")) {
            clearUser();
            router.push("/");
        }
    };

    return (
        <main className="bg-black min-h-screen text-white font-sans overflow-x-hidden flex flex-col relative" dir="rtl">
            {/* Content Wrapper */}
            <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto">
                
                {/* Top App Bar */}
                <div className="sticky top-0 z-50 flex items-center bg-black/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-white/5">
                    <button onClick={() => router.back()} className="text-white flex w-12 h-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    <h2 className="text-white text-xl font-bold leading-tight tracking-tight flex-1 text-center pr-12">
                        الإعدادات
                    </h2>
                </div>

                <div className="flex-1 flex flex-col gap-6 p-6 pb-32">
                    
                    {/* General Section */}
                    <div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 pr-2">عام</h3>
                        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                            
                            {/* Sound Effects */}
                            <div className="flex items-center gap-4 px-5 py-4 justify-between border-b border-white/10 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="text-accent flex items-center justify-center rounded-xl bg-accent/10 shrink-0 w-10 h-10">
                                        <Volume2 className="w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base font-medium leading-normal flex-1">المؤثرات الصوتية</p>
                                </div>
                                <div className="shrink-0 flex items-center">
                                    <button 
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${soundEnabled ? 'bg-accent border border-accent' : 'bg-gray-800 border border-gray-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${soundEnabled ? '-translate-x-6' : '-translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Reminders */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-4 px-5 py-4 justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="text-accent flex items-center justify-center rounded-xl bg-accent/10 shrink-0 w-10 h-10">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <p className="text-white text-base font-medium leading-normal flex-1">التذكير اليومي</p>
                                    </div>
                                    <div className="shrink-0 flex items-center">
                                        <button 
                                            onClick={() => setRemindersEnabled(!remindersEnabled)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${remindersEnabled ? 'bg-accent border border-accent' : 'bg-gray-800 border border-gray-700'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${remindersEnabled ? '-translate-x-6' : '-translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Custom Timer Inline (Only if reminders active) */}
                                {remindersEnabled && (
                                    <div className="px-5 pb-6 pt-2 animate-in slide-in-from-top-4 duration-300">
                                        <div className="relative overflow-hidden rounded-xl border border-accent/20 bg-black/40 p-4">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
                                            <div className="flex gap-4 items-center justify-center rtl:flex-row-reverse">
                                                {/* Hours */}
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 shadow-inner">
                                                        <p className="text-accent text-2xl font-bold tracking-wider">08</p>
                                                    </div>
                                                </div>
                                                <span className="text-gray-600 text-2xl font-bold mb-4">:</span>
                                                {/* Minutes */}
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-accent bg-accent/10 shadow-[0_0_15px_rgba(250,250,51,0.2)] relative">
                                                        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent animate-pulse"></div>
                                                        <p className="text-white text-2xl font-bold tracking-wider">30</p>
                                                    </div>
                                                </div>
                                                {/* AM/PM */}
                                                <div className="flex flex-col items-center gap-2 mr-2">
                                                    <div className="flex h-16 flex-col p-1 bg-gray-900 rounded-lg border border-gray-800">
                                                        <button className="flex-1 px-2 text-[10px] font-bold text-black rounded bg-accent shadow-sm">م</button>
                                                        <button className="flex-1 px-2 text-[10px] font-bold text-gray-500">ص</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-center text-[10px] text-gray-500 mt-3">سيتم تذكيرك يومياً في هذا الوقت</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Appearance Section */}
                    <div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 pr-2 mt-4">المظهر</h3>
                        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                            
                            {/* Dark Mode Locked */}
                            <div className="flex items-center gap-4 px-5 py-4 justify-between opacity-75">
                                <div className="flex items-center gap-4">
                                    <div className="text-gray-400 flex items-center justify-center rounded-xl bg-gray-800 shrink-0 w-10 h-10">
                                        <Moon className="w-5 h-5 fill-current" />
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <p className="text-gray-300 text-base font-bold leading-normal flex-1">الوضع الليلي العميق</p>
                                        <p className="text-gray-500 text-[10px] mt-0.5">مفعل دائماً لحماية العين والتركيز</p>
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center gap-3 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
                                    <Lock className="text-gray-500 w-3 h-3" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Locked</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Session Config */}
                    <div className="bg-gradient-to-br from-violet-900/40 to-black p-5 rounded-2xl border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.1)] mt-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-white font-bold mb-1">جلسات التعلم الذكية (Beta)</h4>
                                <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                                    تقوم الخوارزمية بتخصيص 15-20 كلمة لكل جلسة بناءً على مستواك لضمان تحقيق نظرية i+1.
                                </p>
                            </div>
                            <div className="bg-violet-500/20 text-violet-400 p-2 rounded-lg">
                                <BrainCircuit className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Utility Links */}
                    <div className="mt-auto pt-8 flex flex-col items-center gap-6">
                        <button className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <Info className="w-4 h-4 text-violet-400" />
                            <span className="text-sm font-medium underline underline-offset-4 decoration-violet-400/50 decoration-2 group-hover:decoration-violet-400 transition-all">
                                مركز المساعدة والدعم
                            </span>
                        </button>
                        
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-6 py-3 rounded-full border border-red-500/30 transition-all active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                        >
                            <LogOut className="w-4 h-4" />
                            تسجيل الخروج
                        </button>
                        
                        <p className="text-[10px] text-gray-600 tracking-[0.2em] font-mono mt-2 uppercase">
                            DL-Engine v1.0.4
                        </p>
                    </div>

                </div>
            </div>
        </main>
    );
}
