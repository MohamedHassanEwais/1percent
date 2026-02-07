import { db } from "@/lib/db/dexie";
import { calculateNextReview, initializeWordProgress } from "@/core/algorithms/srs";
import { VocabularyCard, WordProgress } from "@/core/domain/types";

export class WordsRepository {

    /**
     * Seeds the database with initial data if empty.
     */
    async seedDatabase(): Promise<void> {
        const count = await db.words.count();

        // 1. Seed Words (if empty)
        if (count === 0) {
            try {
                // Dynamic import
                const seedData = (await import("@/lib/data/seed.json")).default;

                // Map flat structure (from transform.js) to VocabularyCard
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cards: VocabularyCard[] = seedData.map((item: any, index: number) => ({
                    id: item.word,
                    word: item.word,
                    normalized: item.word.toLowerCase(),
                    rank: item.rank || index + 1,

                    // Content
                    phonetic: typeof item.phonetics === 'string' ? item.phonetics : (item.phonetics?.uk?.[0] || ""),
                    audioUrl: typeof item.audio === 'string' ? item.audio : (item.phonetics?.uk_audio || ""),
                    translation: item.translation || "",
                    definition: item.definition || "",
                    exampleSentence: item.exampleSentence || "",
                    imageUrl: `https://source.unsplash.com/random/400x300/?${item.word},abstract`,

                    level: 'N/A', // Default or derive if available
                    tags: []
                }));

                await db.words.bulkAdd(cards);
                console.log(`[WordsRepo] Seeded ${cards.length} words.`);
            } catch (err) {
                console.error("Failed to seed words:", err);
            }
        }

        // 2. Seed Phrases (Add if missing)
        // Phrases usually have rank > 10000 based on our transform script
        const phraseCheck = await db.words.where('rank').above(10000).first();
        if (!phraseCheck) {
            try {
                const phraseData = (await import("@/lib/data/seed_phrases.json")).default;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const phrases: VocabularyCard[] = phraseData.map((item: any) => ({
                    id: item.word,
                    word: item.word,
                    normalized: item.word.toLowerCase(),
                    rank: item.rank,

                    phonetic: item.phonetics || "",
                    audioUrl: item.audio || "",
                    translation: item.translation || "عبارة",
                    definition: item.definition || "",
                    exampleSentence: item.exampleSentence || "",
                    imageUrl: `https://source.unsplash.com/random/400x300/?abstract,geometric`,

                    level: 'N/A',
                    tags: []
                }));
                await db.words.bulkAdd(phrases);
                console.log(`[WordsRepo] Seeded ${phrases.length} phrases.`);
            } catch (e) {
                // Ignore if file doesn't exist yet
                console.warn("Phrases seed file not found or failed:", e);
            }
        }
    }

    /**
     * Generates a session queue.
     * ...
     */
    async getSessionQueue(limit: number = 10): Promise<{ card: VocabularyCard; progress?: WordProgress }[]> {
        const now = Date.now();

        // 1. Get Due Reviews
        const dueProgress = await db.progress
            .where('nextReview').belowOrEqual(now)
            .and(p => p.status !== 'new')
            .sortBy('nextReview');

        const queue: { card: VocabularyCard; progress?: WordProgress }[] = [];

        // Fetch card details for due items
        for (const p of dueProgress) {
            if (queue.length >= limit) break;
            const card = await db.words.get(p.wordId);
            if (card) {
                queue.push({ card, progress: p });
            }
        }

        // 2. Fill remaining slots with New Words
        if (queue.length < limit) {
            const remaining = limit - queue.length;

            // Get IDs of words already in progress
            const progressIds = await db.progress.toCollection().primaryKeys();

            // Find words NOT in progress (New) - Ordered by Rank
            const newWords = await db.words
                .where('rank').above(0) // All words have rank > 0
                .filter(w => !progressIds.includes(w.id))
                .limit(remaining)
                .toArray();

            for (const card of newWords) {
                queue.push({ card, progress: initializeWordProgress(card.id) });
            }
        }

        return queue;
    }

    /**
     * Submits a review result for a card.
     */
    async submitReview(wordId: string, rating: 1 | 2 | 3 | 4): Promise<void> {
        let progress = await db.progress.get(wordId);

        if (!progress) {
            // Should handle case where it's a new word being reviewed for the first time
            progress = initializeWordProgress(wordId);
        }

        const updatedProgress = calculateNextReview(progress, rating);

        await db.progress.put(updatedProgress);
    }

    /**
     * Resets progress for a specific word (Testing utility)
     */
    async resetWord(wordId: string): Promise<void> {
        await db.progress.delete(wordId);
    }
}

export const wordsRepo = new WordsRepository();
