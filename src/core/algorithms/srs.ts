import { WordProgress, ReviewLog } from "../domain/types";

/**
 * Calculates the next review schedule for a card using the SM-2 algorithm.
 * 
 * @param current The current progress state of the word.
 * @param rating User feedback rating:
 *   1: Again (Fail) - Reset interval
 *   2: Hard - 1.2x interval
 *   3: Good - Standard multiplier
 *   4: Easy - Higher multiplier / bonus
 * 
 * @returns Updated WordProgress object.
 */
export function calculateNextReview(current: WordProgress, rating: 1 | 2 | 3 | 4): WordProgress {
    let { interval, repetitions } = current;
    const { easeFactor } = current;
    const now = Date.now();

    // 1. Calculate new Interval & Repetitions
    if (rating === 1) {
        // Forgot: Reset progress
        repetitions = 0;
        interval = 0.007; // ~10 minutes (in days)
    } else {
        // Remembered
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions++;
    }

    // 2. Update Ease Factor (The "Hardness" of the word)
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // q = rating
    let newEaseFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3; // Minimum floor

    // 3. Create Log
    const log: ReviewLog = {
        date: now,
        rating,
        interval
    };

    // 4. Calculate Next Review Date
    // interval is in days. convert to ms.
    const nextReviewDate = now + (interval * 24 * 60 * 60 * 1000);

    return {
        ...current,
        status: interval > 21 ? 'graduated' : (rating === 1 ? 'learning' : 'review'),
        interval: interval,
        easeFactor: newEaseFactor,
        repetitions: repetitions,
        nextReview: nextReviewDate,
        history: [...current.history, log]
    };
}

/**
 * Creates a fresh progress object for a new word.
 */
export function initializeWordProgress(wordId: string): WordProgress {
    return {
        wordId,
        status: 'new',
        interval: 0,
        easeFactor: 2.5, // Default starting ease
        repetitions: 0,
        nextReview: Date.now(),
        history: []
    };
}
