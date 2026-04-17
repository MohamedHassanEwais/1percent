import { db, type CoreItem, type Progress } from '../store/db';
import { processReview } from './srs-algorithm';

export class ProgressionService {
    static readonly TARGET_MASTERY_PCT = 0.95; // 95% mastery rule
    static readonly SESSION_LIMIT = 7; // Cognitive load limit

    /**
     * Get a learning session of exactly 7 items properly balancing review and new elements,
     * restricted by the 95% mastery rule.
     */
    static async getSessionQueue(): Promise<(CoreItem & { progress?: Progress })[]> {
        const now = Date.now();
        
        // 1. Get Due Reviews
        const dueProgress = await db.progress
            .where('nextReview')
            .belowOrEqual(now)
            .toArray();

        const dueCount = Math.min(dueProgress.length, this.SESSION_LIMIT);
        const sessionProgress = dueProgress.slice(0, dueCount);

        const sessionItems = [];
        
        for (const p of sessionProgress) {
            const word = await db.core_words.get(p.wordId);
            if (word) sessionItems.push({ ...word, progress: p });
        }

        // 2. Add New Items if limit not reached
        if (sessionItems.length < this.SESSION_LIMIT) {
            const needed = this.SESSION_LIMIT - sessionItems.length;
            const newItems = await this.getNextNodes(needed);
            sessionItems.push(...newItems);
        }

        return sessionItems;
    }

    /**
     * Implement the 95% Mastery Rule: "Users cannot unlock the next node or tier
     * (e.g., A1 to A2) until 95% of current active nodes are marked as 'mastered'."
     */
    static async getNextNodes(limit: number): Promise<CoreItem[]> {
        // We evaluate tier by tier.
        const tierOrder = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']; // A0 represents Phase 1/Phonetics usually
        
        let targetTier = tierOrder[0];

        for (const tier of tierOrder) {
            const tierWords = await db.core_words.where('level').equals(tier).toArray();
            if (tierWords.length === 0) continue; // Skip empty tiers
            
            // Check mastery within this tier
            let masteredCount = 0;
            const tierWordIds = tierWords.map(w => w.id);
            const progresses = await db.progress.where('wordId').anyOf(tierWordIds).toArray();
            
            masteredCount = progresses.filter(p => p.status === 'mastered').length;
            const activeNodesCount = tierWords.length;
            
            const masteryPct = masteredCount / activeNodesCount;

            if (masteryPct < this.TARGET_MASTERY_PCT) {
                // Cannot proceed to next tier. Must learn from this tier.
                targetTier = tier;
                break;
            } else if (tier === tierOrder[tierOrder.length -1]) {
                targetTier = tier; // At highest tier
            }
        }

        // Return new unlearned items from the target tier
        const tierWords = await db.core_words.where('level').equals(targetTier).sortBy('rank');
        const progresses = await db.progress.toArray();
        const learnedIds = new Set(progresses.map(p => p.wordId));
        
        const newWords = tierWords.filter(w => !learnedIds.has(w.id)).slice(0, limit);
        return newWords;
    }

    /**
     * Submit a review rating for a word, updating its Spaced Repetition status
     */
    static async submitReview(wordId: string, rating: 1 | 2 | 3 | 4) {
        let progress = await db.progress.get(wordId);
        
        if (!progress) {
            progress = {
                wordId,
                status: 'new',
                interval: 0,
                easeFactor: 2.5,
                repetitions: 0,
                nextReview: 0,
                history: []
            } as unknown as Progress;
        }

        const updatedProgress = processReview(progress as any, rating);
        
        // Save back to local DB
        await db.progress.put(updatedProgress as unknown as Progress);
        return updatedProgress;
    }
}
