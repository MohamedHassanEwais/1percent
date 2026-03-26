"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import Image from "next/image";

const languages = [
  {
    id: "en",
    name: "الإنجليزية",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEE6Kz3o-cQxIHKgCZAA_FLEyyYJsZj8P_jLVNq2yU3smFNoZfjWUDv8u2l0c8LL5D0d7fekQ1x7A8di6qm4yXvYXXBs8-ih4-vZWzub4Yj_hnmMx8ENokGk46aIFQYvLhTVIA880mYsHA3mTj9BcWko0JzJyX_J-BQ89g7uR1_NwJ9Qee4ARp6PE1gQ_EKLOXwVg7Y-TlEkm9d_j_ywi4jlbsZsy1YtLgHqzZYB7hYEqMVyCYfi4-AezbLjPIyIJzTsR0GWp0oww"
  },
  {
    id: "fr",
    name: "الفرنسية",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsv4WiuZgSYVVVdwp2d_1BxFAI6aD3vbQUBTbM4lYCZtB1YBS4QQbGSZIdSWjtqTOgWsGLXhi_u-2tU5NprOSy0RljJtkw-OmBvoIadUEJSRTMxIaxX-UJZY0FJU2H4pctAHEsks5lDmBrormwKlqq0pWnXL454AZVxna09W8Y7xCqCzFvpcjmk6a5_n3AjlFLlNsyrKu1gRautZjqiip8PmcKOtq4qOx2CyR-0_lQj5992HIytMSwkT-w1N4fEDyPfQte3IjAvDI"
  },
  {
    id: "es",
    name: "الإسبانية",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJNoslnUejJxDcgFbQdnOZoZv21WzwpRBDFFoXzfPPnvGfCzTTE4JDqPHuzrBrHVz46bHFfA9pbFjhUAMNEtFNb7Di2bUmix3hpBQe_rlcqzorMys9YDCI_jwpv6Y4MN12Cj4Vp-mWD3we8ngv8XEAa5ssS0nOPMofNIX3xjnADG_oOLl8BJUTiWAGi4hwB9LxHS8gGL1xkM8YR386HTGfNMXuPFvNalH3jYqrG25nkaMpnzAgzgxsb8eke5zSRiQFyemHTR1Wtmo"
  },
  {
    id: "de",
    name: "الألمانية",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4NLy7PkZJdH5V3HXNwd263YyGGMyH_vxjET72CRiff15kG0rT-3Fa4axypNlm9vzt32ehxI2yY8NvANt6EiOU45hKnjq3TBbGQGErod6tVndv_GNJv6zZxLTG_M8CKtHXS4-LMGwQZmWhBlEQ9lUoWShCb47gPMYhADoEZgBnsx9UeJq8yZOMD0g5ywDnYgk7dtV89EH3B8N9mv-5Sd_HCRMohakoACqKPeColkyNWAHG_MJcGh6sVD1cZ27eNxV1bhPwTTGsvfs"
  }
];

export default function TargetLanguageSelection() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string>("en");

  const handleStart = () => {
    // Navigate to placement test flow
    router.push("/onboarding/placement");
  };

  return (
    <main className="min-h-screen bg-background text-white flex flex-col items-center p-6 selection:bg-accent selection:text-black overflow-x-hidden relative">
      <div className="flex-1 w-full max-w-4xl py-12 flex flex-col justify-center items-center z-10">
        
        {/* Header Section */}
        <header className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            أي لغة تود تعلمها؟
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            اختر مسارك التعليمي وانطلق في رحلة الإتقان مع Delta Leap
          </p>
        </header>

        {/* Language Selection Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16 px-4 md:px-0 rtl">
          {languages.map((lang) => {
            const isSelected = selectedLang === lang.id;
            
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                className={`group relative flex flex-col items-center justify-center p-8 rounded-xl transition-all duration-300 transform
                  ${isSelected 
                    ? 'bg-gray-800 ring-2 ring-accent ring-offset-4 ring-offset-background shadow-[0_0_30px_rgba(250,250,51,0.15)] scale-105' 
                    : 'bg-surface hover:bg-gray-800 hover:-translate-y-1'
                  }
                `}
              >
                <div className={`w-20 h-20 rounded-full overflow-hidden mb-6 transition-all duration-500
                  ${isSelected ? 'border-4 border-accent/20 scale-105' : 'grayscale group-hover:grayscale-0'}
                `}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={lang.image} 
                    alt={lang.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <span className={`text-xl font-bold transition-colors ${isSelected ? 'text-accent' : 'text-gray-300 group-hover:text-white'}`}>
                  {lang.name}
                </span>

                {isSelected && (
                  <div className="absolute top-3 left-3 bg-accent text-black rounded-full p-1 shadow-lg animate-in zoom-in duration-200">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="flex flex-row-reverse items-center gap-2 mb-12">
          <div className="h-1.5 w-8 rounded-full bg-accent shadow-[0_0_8px_rgba(250,250,51,0.5)]" />
          <div className="h-1.5 w-2 rounded-full bg-gray-800" />
          <div className="h-1.5 w-2 rounded-full bg-gray-800" />
        </div>

        {/* Primary Action */}
        <div className="w-full max-w-sm px-4">
          <button 
            onClick={handleStart}
            className="w-full py-5 rounded-xl bg-gradient-to-r from-yellow-500 to-accent text-black font-black text-xl flex flex-row-reverse items-center justify-center gap-3 active:scale-95 hover:scale-[1.02] transition-all duration-150 shadow-[0_4px_24px_rgba(250,250,51,0.25)] group"
          >
            <span>ابدأ الآن</span>
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
        
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
    </main>
  );
}
