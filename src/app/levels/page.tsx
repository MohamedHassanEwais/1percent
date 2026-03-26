"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useUserStore } from "@/core/store/user-store";
import { LevelCard } from "@/features/levels/LevelCard";
import { CEFRLevel } from "@/core/domain/types";

const LEVELS: { id: CEFRLevel; title: string; description: string; totalWords: number }[] = [
    { id: 'A0', title: 'Phonetics', description: 'Master the 44 sounds of English to perfect your pronunciation.', totalWords: 44 },
    { id: 'A1', title: 'Beginner', description: 'Essential vocabulary and basic phrases for daily survival.', totalWords: 500 },
    { id: 'A2', title: 'Elementary', description: 'Describe routine tasks and personal background with confidence.', totalWords: 1000 },
    { id: 'B1', title: 'Intermediate', description: 'Handle most travel situations and produce connected text.', totalWords: 2000 },
    { id: 'B2', title: 'Upper Intermediate', description: 'Interact with native speakers fluently and spontaneously.', totalWords: 3000 },
    { id: 'C1', title: 'Advanced', description: 'Express ideas fluently without obvious searching for expressions.', totalWords: 4000 },
];

const LEVEL_ORDER: CEFRLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function LevelSelectionPage() {
    const router = useRouter();
    const { maxUnlockedLevel, setTargetLevel } = useUserStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLevelLocked = (level: CEFRLevel) => {
        const targetIndex = LEVEL_ORDER.indexOf(level);
        const unlockedIndex = LEVEL_ORDER.indexOf(maxUnlockedLevel || 'A0');
        return targetIndex > unlockedIndex;
    };

    const handleLevelSelect = (level: CEFRLevel) => {
        setTargetLevel(level);
        router.push('/session'); // Navigate to study session
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-black text-zinc-100 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center gap-4 mb-12">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-zinc-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            Select Your Level
                        </h1>
                        <p className="text-zinc-500 mt-1">Choose a difficulty level to start your session.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {LEVELS.map((level, index) => (
                        <motion.div
                            key={level.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <LevelCard
                                level={level.id}
                                title={level.title}
                                description={level.description}
                                isLocked={isLevelLocked(level.id)}
                                progress={0} // TODO: Implement real progress calculation
                                totalWords={level.totalWords} // Estimate
                                onSelect={handleLevelSelect}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
