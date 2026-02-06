"use client";

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

export default function SessionPage() {
    const router = useRouter();
    const [queue, setQueue] = useState<{ card: VocabularyCard; progress?: WordProgress }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const addXp = useUserStore((state) => state.addXp); // Connect to store

    // Load Queue on Mount
    useEffect(() => {
        async function loadSession() {
            // Seed database if empty
            await wordsRepo.seedDatabase();

            const newQueue = await wordsRepo.getSessionQueue(10);
            setQueue(newQueue);
            setIsLoading(false);
        }
        loadSession();
    }, []);

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
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150); // Small delay for animation
        } else {
            // Session Complete
            router.push("/summary");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (queue.length === 0) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-black text-white p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">No cards due for review!</h2>
                <NeonButton onClick={() => router.push("/map")}>Return to Galaxy</NeonButton>
            </div>
        );
    }

    const currentItem = queue[currentIndex];
    const progress = (currentIndex / queue.length) * 100;

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

            {/* 2. The Card Area */}
            <div className="w-full max-w-md aspect-[3/4] perspective-1000 relative">
                <AnimatePresence mode="wait">
                    {!isFlipped ? (
                        <FlashcardFront
                            key={`front-${currentItem.card.id}`}
                            card={currentItem.card}
                            onFlip={handleFlip}
                        />
                    ) : (
                        <FlashcardBack
                            key={`back-${currentItem.card.id}`}
                            card={currentItem.card}
                            onRate={handleRate}
                        />
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}
