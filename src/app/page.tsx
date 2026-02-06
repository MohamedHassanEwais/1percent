"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate check for auth or existing session
    const timer = setTimeout(() => {
      // Redirect to walkthrough for now (later checks logic)
      router.push("/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="relative flex flex-col items-center">
        {/* Pulsing Glow */}
        <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/20 blur-3xl filter" />

        {/* Logo Text */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-8xl font-black tracking-tighter text-white"
        >
          1<span className="text-primary">%</span>
        </motion.h1>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 font-heading text-lg tracking-[0.2em] text-slate-400"
        >
          BETTER EVERY DAY
        </motion.p>
      </div>
    </div>
  );
}
