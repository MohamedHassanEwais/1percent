"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // If user is already logged in, redirect to Map immediately (skip welcome)
      if (user) {
        // Small delay to let the logo breathe, but faster than guest
        setTimeout(() => {
          router.push("/map");
        }, 1500);
      } else {
        // No user, go to Onboarding after animation
        setTimeout(() => {
          router.push("/welcome");
        }, 2500);
      }
    });

    return () => unsubscribe();
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
