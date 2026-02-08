"use client";

// Force dynamic rendering to fix build error with searchParams
export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { wordsRepo } from "@/core/services/words-repo";
import { VocabularyCard, WordProgress } from "@/core/domain/types";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useUserStore } from "@/core/store/user-store";
import { FlashcardFront } from "@/features/study/FlashcardFront";
import { FlashcardBack } from "@/features/study/FlashcardBack";
import { useRouter, useSearchParams } from "next/navigation";

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
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    const [queue, setQueue] = useState<{ card: VocabularyCard; progress?: WordProgress }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Stats Tracking
    const [sessionStats, setSessionStats] = useState({
        correct: 0,
        newLearned: 0,
        reviews: 0
    });

    const { addXp, targetLevel, setTargetLevel } = useUserStore();

    // Load Queue on Mount
    useEffect(() => {
        loadSession();
    }, [targetLevel, mode, limit]);

    async function loadSession() {
        setIsLoading(true);
        // Seed database if empty
        await wordsRepo.seedDatabase();

        let newQueue;
        if (mode === 'review') {
            newQueue = await wordsRepo.getReviewQueue(limit);
        } else {
            newQueue = await wordsRepo.getNewWordsQueue(limit, targetLevel);
        }

        setQueue(newQueue);
        setCurrentIndex(0);
        setSessionStats({ correct: 0, newLearned: 0, reviews: 0 }); // Reset stats
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

            // Update Stats
            setSessionStats(prev => ({
                ...prev,
                correct: rating >= 3 ? prev.correct + 1 : prev.correct,
                newLearned: mode === 'new' ? prev.newLearned + 1 : prev.newLearned,
                reviews: mode === 'review' ? prev.reviews + 1 : prev.reviews
            }));
        }

        // Move to next
        if (currentIndex < queue.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
        } else {
            finishSession();
        }
    };

    const finishSession = () => {
        // Calculate final stats to pass
        const totalCards = queue.length;
        // In 'new' mode, 'correct' might effectively be 100% since "Got It" is the only option, 
        // but let's calculate based on what we tracked.
        // For new words, we might want to say 100% accuracy if they finished.
        // For review, it's actual accuracy.

        // If we exit early, queue length might be bigger than reviewed. 
        // We should track how many we actually did.
        const actualReviewed = currentIndex + 1;

        // Current item is the one we JUST finished if called from handleRate.
        // But if called from Exit button, we haven't finished current item.

        // Wait, handleRate calls finishSession AFTER index check.
        // So actualReviewed is full queue length.

        const accuracy = Math.round((sessionStats.correct / totalCards) * 100) || 0;

        // Construct query params
        const query = new URLSearchParams({
            reviewed: sessionStats.reviews.toString(),
            new: sessionStats.newLearned.toString(),
            accuracy: accuracy.toString(),
            total: totalCards.toString()
        }).toString();

        router.push(`/summary?${query}`);
    };

    const handleExit = () => {
        // When exiting early, we calculate stats based on what we've done so far *excluding* the current open card
        const completedCount = currentIndex;
        const accuracy = completedCount > 0 ? Math.round((sessionStats.correct / completedCount) * 100) : 0;

        const query = new URLSearchParams({
            reviewed: sessionStats.reviews.toString(),
            new: sessionStats.newLearned.toString(),
            accuracy: accuracy.toString(),
            total: completedCount.toString()
        }).toString();

        router.push(`/summary?${query}`);
    };

    if (isLoading) {
        return <SessionLoading />;
    }

    // Guard clause for empty queue
    if (queue.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-screen bg-black text-white p-6">
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
        );
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

            {/* Top Controls */}
            <div className="absolute top-4 left-4 z-50">
                <button
                    onClick={handleExit}
                    className="p-2 bg-black/50 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white border border-white/5"
                >
                    <X className="w-6 h-6" />
                </button>
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
