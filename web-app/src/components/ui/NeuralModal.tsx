"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, X } from "lucide-react";

interface NeuralModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export function NeuralModal({ isOpen, onClose, title, message }: NeuralModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    >
                        <GlassCard className="w-full max-w-sm border-[#CCFF00]/50 shadow-[0_0_30px_rgba(204,255,0,0.2)]" intensity="high">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-[#CCFF00]">
                                    <BrainCircuit className="h-5 w-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">System Message</span>
                                </div>
                                <button onClick={onClose} className="text-slate-400 hover:text-white">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                {message}
                            </p>

                            <NeonButton onClick={onClose} className="w-full" size="sm">
                                Acknowledge
                            </NeonButton>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
