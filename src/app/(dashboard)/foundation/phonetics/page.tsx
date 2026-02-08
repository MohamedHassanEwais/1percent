"use client";

import React, { useState } from "react";
import { PHONETICS_DATA, PhoneticSound } from "@/features/foundation/phonetics-data";
import { SoundCard } from "@/features/foundation/SoundCard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { NeonButton } from "@/components/ui/NeonButton";

export default function PhoneticsPage() {
    const router = useRouter();
    const [selectedSound, setSelectedSound] = useState<PhoneticSound | null>(null);

    const monophthongs = PHONETICS_DATA.filter(s => s.category === 'monophthong');
    const diphthongs = PHONETICS_DATA.filter(s => s.category === 'diphthong');
    const consonants = PHONETICS_DATA.filter(s => s.category === 'consonant');

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 bg-slate-800/50 rounded-full hover:bg-slate-700 transition"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                        Phonetics Laboratory
                    </h1>
                    <p className="text-slate-400">Master the 44 sounds of English</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto space-y-12">

                {/* Section 1: Monophthongs */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-xl font-bold text-slate-200">Vowels (Monophthongs)</h2>
                        <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded">12 Sounds</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {monophthongs.map(sound => (
                            <SoundCard key={sound.id} sound={sound} onClick={() => setSelectedSound(sound)} />
                        ))}
                    </div>
                </section>

                {/* Section 2: Diphthongs */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-xl font-bold text-slate-200">Diphthongs (Gliding Vowels)</h2>
                        <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded">8 Sounds</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {diphthongs.map(sound => (
                            <SoundCard key={sound.id} sound={sound} onClick={() => setSelectedSound(sound)} />
                        ))}
                    </div>
                </section>

                {/* Section 3: Consonants */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-xl font-bold text-slate-200">Consonants</h2>
                        <span className="text-xs bg-lime-900/30 text-lime-400 px-2 py-1 rounded">24 Sounds</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                        <span className="inline-block w-2 h-2 rounded-full bg-lime-400 mr-2 shadow-[0_0_5px_#CCFF00]"></span> Voiced (Vibration)
                        <span className="inline-block w-2 h-2 rounded-full bg-slate-600 ml-4 mr-2"></span> Unvoiced (Air only)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {consonants.map(sound => (
                            <SoundCard key={sound.id} sound={sound} onClick={() => setSelectedSound(sound)} />
                        ))}
                    </div>
                </section>

            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedSound && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSound(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-[#0A0A0A] border border-cyan-500/20 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(34,211,238,0.1)]"
                        >
                            <button
                                onClick={() => setSelectedSound(null)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white"
                            >
                                ✕
                            </button>

                            <div className="text-center mb-8">
                                <span className="text-8xl font-mono font-bold text-cyan-400 block mb-2 shadow-cyan- glow">
                                    {selectedSound.ipa}
                                </span>
                                <h3 className="text-2xl font-bold text-white">{selectedSound.name}</h3>
                                <p className="text-slate-400 mt-2">{selectedSound.description}</p>
                            </div>

                            {/* Placeholder for Video/Animation */}
                            <div className="bg-slate-900/50 rounded-xl aspect-video flex items-center justify-center border border-slate-800 mb-6">
                                <div className="text-center">
                                    <span className="text-4xl mb-2 block">🎥</span>
                                    <span className="text-sm text-slate-500">Mouth Position Video</span>
                                    <p className="text-xs text-slate-600 mt-1">(Coming Soon)</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs uppercase text-slate-500 font-bold tracking-widest">Example Words</p>
                                <div className="flex gap-2 justify-center">
                                    {selectedSound.examples.map(ex => (
                                        <div key={ex} className="bg-slate-800 px-4 py-2 rounded-lg text-lg text-cyan-100">
                                            {ex}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8">
                                <NeonButton variant="primary" className="w-full py-4 text-lg">
                                    PLAY SOUND 🔊
                                </NeonButton>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
