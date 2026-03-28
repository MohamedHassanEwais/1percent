"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Send, Bot, User, BrainCircuit, Sparkles } from "lucide-react";

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export default function AITutorPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      role: "system",
      content: `DEPTH Framework Active:
[D] Persona: Supportive English Tutor. 
[E] Constraint i+1: Speak strictly at A2-B1 level. 
[P] Context: The user wants to practice airport conversational skills. 
[T] Task: Initiate a roleplay where you are the checking counter agent.`
    },
    {
      id: "msg-2",
      role: "assistant",
      content: "أهلاً بك في جلسة المحادثة التفاعلية! أنا ديلتا، مدرسك الشخصي. 🤖\nسنقوم اليوم بتدريب بسيط: تخيل أنك في المطار وتريد تسجيل الدخول لرحلتك. سأبدأ أنا:\n\nHello! Can I see your passport and ticket, please?"
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock LLM response demonstrating the i+1 constraint
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Great job! كلمة 'Here' صحيحة تماماً. \n\nNow, do you have any checked baggage or just a carry-on bag? \n*(تذكر: checked baggage تعني حقائب الشحن، و carry-on تعني حقيبة اليد)*"
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <main className="bg-black min-h-screen text-white font-sans overflow-hidden flex flex-col relative" dir="rtl">
      
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="flex items-center px-4 py-4 justify-between">
          <button 
            onClick={() => router.back()} 
            className="text-gray-400 hover:text-white flex w-10 h-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-white text-base font-bold tracking-tight leading-none">
                المعلم الذكي
              </h2>
              <span className="text-xs text-blue-400 font-medium mt-1">يُدار بواسطة ديلتا AI</span>
            </div>
          </div>
          
          <div className="w-10 flex justify-end">
            <BrainCircuit className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6 relative">
        {messages.map((msg) => {
          if (msg.role === 'system') {
            return (
              <div key={msg.id} className="flex justify-center w-full my-2">
                <div className="bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-center max-w-[85%]">
                  <div className="flex items-center justify-center gap-2 text-accent/80 font-mono text-[10px] uppercase tracking-widest mb-1 ltr" dir="ltr">
                    <Sparkles className="w-3 h-3" />
                    <span>System Prompt (Hidden in Prod)</span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono text-left ltr whitespace-pre-wrap" dir="ltr">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          }

          const isUser = msg.role === 'user';

          return (
            <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-auto ${isUser ? 'bg-gray-800' : 'bg-blue-500/20 border border-blue-500/30'}`}>
                  {isUser ? <User className="w-4 h-4 text-gray-400" /> : <Bot className="w-4 h-4 text-blue-400" />}
                </div>

                {/* Bubble */}
                <div className={`px-4 py-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                  isUser 
                    ? 'bg-gray-800 text-white rounded-br-sm' 
                    : 'bg-[#1a1a1a] border border-gray-800 text-gray-200 rounded-bl-sm shadow-[0_5px_20px_rgba(0,0,0,0.3)]'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex w-full justify-start">
            <div className="flex gap-3 max-w-[85%] flex-row">
              <div className="w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-auto bg-blue-500/20 border border-blue-500/30">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-[#1a1a1a] border border-gray-800 rounded-bl-sm flex gap-1 items-center h-12">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/80 backdrop-blur-md border-t border-white/5 pb-8">
        <div className="relative flex items-center bg-gray-900 border border-gray-800 rounded-full p-2 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all shadow-inner">
          <input 
            type="text" 
            placeholder="اكتب ردك باللغة الإنجليزية..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-white text-sm ltr"
            dir="ltr"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center shrink-0 disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(250,250,51,0.2)]"
          >
            <Send className="w-5 h-5 rtl:-scale-x-100" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-3 font-medium">يتم التدريب الفوري بمراقبة دقيقة لمنهجية i+1 لفهم أعمق</p>
      </div>

    </main>
  );
}
