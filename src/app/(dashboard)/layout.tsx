"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, BarChart2, Play, Map, User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "الرئيسية", href: "/home" },
    { icon: BarChart2, label: "الإحصائيات", href: "/stats" },
    { icon: Play, label: "جلسة", href: "/session", isPrimary: true },
    { icon: Map, label: "الخريطة", href: "/map" },
    { icon: User, label: "الملف", href: "/profile" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#131313] text-white overflow-x-hidden selection:bg-accent selection:text-black rtl">
      
      {/* Main Content Container with bottom padding for the nav bar */}
      <main className="relative h-full w-full pb-24">
        {children}
      </main>

      {/* Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#1a1a1a]/90 backdrop-blur-xl border-t border-gray-800 pb-safe pt-2 z-50">
        <div className="flex justify-around items-end pb-4 px-2 max-w-md mx-auto rtl text-right flex-row-reverse">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.isPrimary) {
              return (
                <div key={item.href} className="relative -top-5">
                  <Link href={item.href}>
                    <button className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-black shadow-[0_0_20px_rgba(250,250,51,0.4)] hover:scale-105 active:scale-95 transition-transform">
                      <Icon className="w-7 h-7 ml-1" />
                    </button>
                  </Link>
                </div>
              );
            }

            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`group flex flex-col items-center justify-center gap-1 w-16 transition-colors ${
                  isActive ? 'text-accent' : 'text-gray-500 hover:text-white'
                }`}
              >
                <div className={`relative p-2 rounded-xl transition-all ${
                  isActive ? 'bg-accent/10' : 'group-hover:bg-white/5'
                }`}>
                  <Icon className={`w-6 h-6 ${isActive && 'fill-accent/20'}`} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_rgba(250,250,51,0.8)]" />
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      <style jsx global>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </div>
  );
}
