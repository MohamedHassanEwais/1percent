"use client";

// Force dynamic rendering to fix build error with searchParams
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { wordsRepo } from "@/core/services/words-repo";
import { VocabularyCard, WordProgress } from "@/core/domain/types";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/core/store/user-store"; // Integrated Store

// Placeholder for now, will separate later
import { FlashcardFront } from "@/features/study/FlashcardFront";
import { FlashcardBack } from "@/features/study/FlashcardBack";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function SessionLoading() {
    return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
}

function SessionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') === 'review' ? 'review' : 'new';

    const [queue, setQueue] = useState<{ card: VocabularyCard; progress?: WordProgress }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { addXp, targetLevel, setTargetLevel } = useUserStore();

    // Load Queue on Mount
    useEffect(() => {
        loadSession();
    }, [targetLevel, mode]);

    async function loadSession() {
        setIsLoading(true);
        // Seed database if empty
        await wordsRepo.seedDatabase();

        let newQueue;
        if (mode === 'review') {
            newQueue = await wordsRepo.getReviewQueue(10);
        } else {
            newQueue = await wordsRepo.getNewWordsQueue(10, targetLevel);
        }

        setQueue(newQueue);
        setCurrentIndex(0);
        setIsLoading(false);
    }

    const handleFlip = () => {
        setIsFlipped(true);
    };

    const handleRate = async (rating: 1 | 2 | 3 | 4) => {
        const currentItem = queue[currentIndex];
        if (currentItem) {
            await wordsRepo.submitReview(currentItem.card.id, rating);

            // Award XP based on rating
            const xpGain = rating === 4 ? 15 : rating === 3 ? 10 : 5;
            addXp(xpGain);
        }

        // Move to next
        if (currentIndex < queue.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
        } else {
            // Session Complete
            router.push("/summary");
        }
    };

    if (isLoading) {
        return <SessionLoading />;
    }

    const currentItem = queue[currentIndex];
    const progress = queue.length > 0 ? (currentIndex / queue.length) * 100 : 0;

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black text-white flex flex-col items-center justify-center p-4">

            {/* 1. Progress Bar (Top) */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                <motion.div
                    className="h-full bg-primary shadow-[0_0_10px_#CCFF00]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            {/* Level Selector - Top Right (Only show for 'new' mode) */}
            {mode === 'new' && (
                <div className="absolute top-4 right-4 z-50">
                    <select
                        value={targetLevel}
                        onChange={(e) => setTargetLevel(e.target.value as any)}
                        className="bg-zinc-900 border border-zinc-700 text-xs rounded px-2 py-1 text-zinc-400 focus:outline-none focus:border-primary"
                    >
                        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
                            <option key={lvl} value={lvl}>{lvl} Level</option>
                        ))}
                    </select>
                </div>
            )}

            {/* 2. The Card Area */}
            {queue.length > 0 ? (
                <div className="w-full max-w-md aspect-[3/4] perspective-1000 relative">
                    <AnimatePresence mode="wait">
                        {!isFlipped ? (
                            <FlashcardFront
                                key={`front-${currentItem.card.id}`}
                                card={currentItem.card}
                                onFlip={handleFlip}
                                status={mode === 'new' ? 'new' : 'review'}
                            />
                        ) : (
                            <FlashcardBack
                                key={`back-${currentItem.card.id}`}
                                card={currentItem.card}
                                onRate={handleRate}
                                mode={mode === 'new' ? 'new' : 'review'}
                            />
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center max-w-md p-6">
                    <h2 className="text-xl font-bold mb-2 text-zinc-200">
                        {mode === 'review' ? "All caught up! 🎉" : `No new words found for ${targetLevel}!`}
                    </h2>
                    <p className="text-zinc-500 mb-6">
                        {mode === 'review'
                            ? "You've reviewed all your due cards. Great job!"
                            : "Try changing the level or checking your profile."}
                    </p>
                    <div className="flex gap-4">
                        <NeonButton variant="outline" onClick={() => router.push("/map")}>Return to Galaxy</NeonButton>
                    </div>
                </div>
            )}

        </div>
    );
}

export default function SessionPage() {
    return (
        <Suspense fallback={<SessionLoading />}>
            <SessionContent />
        </Suspense>
    );
}
