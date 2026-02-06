"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (provider: 'google' | 'guest') => {
        setIsLoading(true);
        // Simulate Login Delay
        setTimeout(() => {
            setIsLoading(false);
            router.push("/map"); // Go to Galaxy
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            {/* Brand Header */}
            <div className="text-center">
                <h1 className="text-4xl font-heading font-black tracking-tighter text-white">
                    1<span className="text-primary">%</span>
                </h1>
                <p className="text-slate-500 uppercase tracking-widest text-xs mt-2">Access Mainframe</p>
            </div>

            <GlassCard className="w-full space-y-6 p-8" intensity="high" glow="violet">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
                    <p className="text-sm text-slate-400">Sign in to sync your neural progress.</p>
                </div>

                <div className="space-y-3">
                    <NeonButton
                        variant="outline"
                        className="w-full bg-white text-black hover:bg-white/90 border-transparent"
                        onClick={() => handleLogin('google')}
                        disabled={isLoading}
                    >
                        {/* Google Icon SVG */}
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                        Continue with Google
                    </NeonButton>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-slate-500">Or continue as</span>
                        </div>
                    </div>

                    <NeonButton
                        variant="secondary"
                        className="w-full"
                        onClick={() => handleLogin('guest')}
                        isLoading={isLoading}
                    >
                        Guest User
                    </NeonButton>
                </div>
            </GlassCard>

            <p className="text-center text-xs text-slate-600">
                By accessing the system, you agree to our <span className="underline cursor-pointer hover:text-white">Terms of Protocol</span>.
            </p>
        </div>
    );
}
