"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to walkthrough after 3 seconds
    const timer = setTimeout(() => {
      router.push("/walkthrough");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center p-8 bg-background overflow-hidden selection:bg-accent selection:text-black">
      {/* Background Ambient Detail (Subtle Grain/Texture) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3S3xYl3K9tVX1JlFTGJXPjitfowu8WpzlGYqH76QtEoe3iezaq3S3h22o2ZzLH6rQ2rmzQhXT2_6OOJ3RYslaTKhJeedDkH7Glb1pqGIvMOi1bKEUjX0CA2EPK2nlnC7O9yCmXJBVruVuDgHYvnFpw__9760l5AHhR4A_Uzf1rWuIBf4s418eBzOww6taZINqnOeBGQlPj51hqXaRrcLMSXKBvedHxTp1XPzey3iD0n4LtrzYEanyQU9xB3UQ5TKsJfD_uTwdWRo')"
        }}
      />
      
      {/* Center Content Branding */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Abstract 'A' Logo with Arabic Influence */}
        <div className="relative animate-pulse-glow">
          {/* Outer Glow Layer */}
          <div className="absolute inset-0 bg-accent blur-3xl opacity-20 rounded-full" />
          
          {/* The Logo Core */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full text-accent fill-current" viewBox="0 0 100 100">
              {/* Abstract Forward Pointing Arrow / Stylized Alif-like 'A' */}
              <path 
                d="M20 80 L50 20 L80 80 M50 20 V60 M40 50 H60" 
                fill="none" 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="8"
              />
              <path 
                d="M50 20 L90 20 V60" 
                fill="none" 
                opacity="0.5" 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeWidth="4"
              />
              {/* Decorative Dot (Nuqta) influence */}
              <circle cx="50" cy="10" r="4" />
            </svg>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-accent drop-shadow-md">
            دلتا ليب
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium tracking-[0.2em] uppercase opacity-60">
            Delta Leap
          </p>
        </div>
      </div>

      {/* Loading Indicator Area */}
      <div className="absolute bottom-24 w-full max-w-[200px] px-4">
        {/* Progress Track */}
        <div className="h-[2px] w-full bg-surface rounded-full overflow-hidden relative">
          {/* Animated Progress Fill */}
          <div className="absolute h-full bg-accent loading-bar-animation shadow-[0_0_8px_rgba(250,250,51,0.5)]" />
        </div>
        
        {/* Loading Text */}
        <div className="mt-6 flex justify-center">
          <span className="text-[10px] text-accent font-bold tracking-widest opacity-80">
            جاري التحميل...
          </span>
        </div>
      </div>

      {/* Bottom Brand Footnote (Minimalist) */}
      <div className="absolute bottom-10">
        <p className="text-[10px] text-white/20 tracking-wider font-light">
          © 2026 THE NEON SCHOLAR ECOSYSTEM
        </p>
      </div>
      
      {/* Invisible Accessibility Landmark */}
      <footer className="sr-only">
        Splash screen for Delta Leap language learning application.
      </footer>
    </main>
  );
}
