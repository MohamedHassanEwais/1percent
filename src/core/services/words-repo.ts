import { db } from "@/lib/db/dexie";
import { calculateNextReview, initializeWordProgress } from "@/core/algorithms/srs";
import { VocabularyCard, WordProgress, CEFRLevel } from "@/core/domain/types";
import { SyncService } from "@/core/services/sync-service";
import { auth } from "@/lib/firebase";
import seedData from "@/lib/data/seed-v2.json"; // V2 Data

export class WordsRepository {

    constructor() {
        if (typeof window !== "undefined") {
            this.checkAndSeed();
        }
    }

    private async checkAndSeed() {
        const count = await db.words.count();
        const isV2Seeded = localStorage.getItem('is_v2_seeded');

        // Force re-seed for V2 update
        if (count === 0 || !isV2Seeded) {
            console.log("[WordsRepo] Seeding/Updating to V2 data...");
            await this.seedDatabase(true);
            localStorage.setItem('is_v2_seeded', 'true');
        }
    }

    /**
     * Seeds the database with initial data if empty.
     */
    async seedDatabase(force = false): Promise<void> {
        const count = await db.words.count();

        // 1. Seed Words (if empty or forced)
        if (count === 0 || force) {
            await this.performSeed();
        } else {
            // ... legacy checks

            // Check if migration is needed (if first word missing level)
            const firstWord = await db.words.orderBy('id').first();
            if (firstWord && !firstWord.level) {
                console.log("[WordsRepo] Detecting missing levels. Migrating...");
                await this.migrateLevels();
            }
            // Check if A1 is empty but we have words (another sign of corruption/legacy data)
            const a1Count = await db.words.where('level').equals('A1').count();
            if (count > 0 && a1Count === 0) {
                console.log("[WordsRepo] No A1 words found. Triggering migration...");
                await this.migrateLevels();
            }
        }

        // 2. Seed Phrases (Add if missing)
        // Phrases usually have rank > 10000 based on our transform script
        const phraseCheck = await db.words.where('rank').above(10000).first();
        if (!phraseCheck) {
            await this.seedPhrases();
        }
    }

    private async performSeed() {
        try {
            // Dynamic import
            const seedData = (await import("@/lib/data/seed.json")).default;

            // Map flat structure (from transform.js) to VocabularyCard
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cards: VocabularyCard[] = seedData.map((item: any, index: number) => {
                const rank = item.rank || index + 1;
                return {
                    id: item.word,
                    word: item.word,
                    normalized: item.word.toLowerCase(),
                    rank: rank,
                    // Content
                    phonetic: typeof item.phonetics === 'string' ? item.phonetics : (item.phonetics?.uk?.[0] || ""),
                    audioUrl: typeof item.audio === 'string' ? item.audio : (item.phonetics?.uk_audio || ""),
                    translation: item.translation || "",
                    definition: item.definition || "",
                    exampleSentence: item.exampleSentence || "",
                    imageUrl: `https://source.unsplash.com/random/400x300/?${item.word},abstract`,

                    pos: item.pos || "word",
                    level: this.getLevelFromRank(rank),
                    tags: []
                };
            });

            await db.words.bulkAdd(cards);
            console.log(`[WordsRepo] Seeded ${cards.length} words.`);
        } catch (err) {
            console.error("Failed to seed words:", err);
        }
    }

    private async seedPhrases() {
        try {
            // Check if phrases already exist to avoid duplicates if partial seed
            const existing = await db.words.where('rank').above(10000).count();
            if (existing > 0) return;

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

                pos: "phrase",
                level: 'N/A', // Phrases don't have CEFR levels in our seed yet
                tags: []
            }));
            await db.words.bulkAdd(phrases);
            console.log(`[WordsRepo] Seeded ${phrases.length} phrases.`);
        } catch (e) {
            console.warn("Phrases seed file not found or failed:", e);
        }
    }

    /**
     * Generates a session queue for PHRASES only.
     */
    async getPhraseSession(limit: number = 5): Promise<{ card: VocabularyCard; progress?: WordProgress }[]> {
        const queue: { card: VocabularyCard; progress?: WordProgress }[] = [];

        // 1. Get Due Phrase Reviews
        const now = Date.now();
        const dueProgress = await db.progress
            .where('nextReview').belowOrEqual(now)
            .and(p => p.status !== 'new') // Filter in memory if needed, but 'nextReview' implies scheduled
            .sortBy('nextReview');

        // Filter for phrases (rank > 10000)
        // Since we can't join easily, we fetch the card for each due progress and check rank/pos
        for (const p of dueProgress) {
            if (queue.length >= limit) break;
            const card = await db.words.get(p.wordId);
            if (card && (card.pos === 'phrase' || card.rank > 10000)) {
                queue.push({ card, progress: p });
            }
        }

        if (queue.length >= limit) return queue;

        // 2. Fill with New Phrases
        const remaining = limit - queue.length;
        const progressIds = await db.progress.toCollection().primaryKeys();

        const newPhrases = await db.words
            .where('rank').above(10000)
            .filter(w => !progressIds.includes(w.id))
            .limit(remaining)
            .toArray();

        for (const card of newPhrases) {
            queue.push({ card, progress: initializeWordProgress(card.id) });
        }

        return queue;
    }

    private getLevelFromRank(rank: number): CEFRLevel {
        if (rank > 4000) return 'C2';
        if (rank > 3000) return 'C1';
        if (rank > 2000) return 'B2';
        if (rank > 1000) return 'B1';
        if (rank > 500) return 'A2';
        return 'A1';
    }

    private async migrateLevels() {
        // Fetch all words
        const allWords = await db.words.toArray();

        const updates = allWords.map(word => {
            if (!word.level || word.level === 'N/A') {
                return {
                    key: word.id,
                    changes: { level: this.getLevelFromRank(word.rank) }
                };
            }
            return null;
        }).filter(u => u !== null);

        if (updates.length > 0) {
            await db.transaction('rw', db.words, async () => {
                for (const update of updates) {
                    // @ts-ignore
                    await db.words.update(update.key, update.changes);
                }
            });
            console.log(`[WordsRepo] Migrated levels for ${updates.length} words.`);
        }
    }

    /**
     * Generates a session queue.
     * Use filters to focus on specific levels
     */
    /**
     * Generates a session queue for NEW words only.
     */
    async getNewWordsQueue(limit: number = 10, targetLevel: CEFRLevel = 'A1'): Promise<{ card: VocabularyCard; progress?: WordProgress }[]> {
        const queue: { card: VocabularyCard; progress?: WordProgress }[] = [];

        // Get IDs of words already in progress
        const progressIds = await db.progress.toCollection().primaryKeys();

        let newWordsCollection = db.words.orderBy('rank');

        // Apply level filter if specified
        if (targetLevel && targetLevel !== 'N/A') {
            newWordsCollection = db.words.where('level').equals(targetLevel);
        }

        // Fetch and Sort
        let candidateWords = await newWordsCollection
            .filter(w => !progressIds.includes(w.id))
            .toArray();

        // Explicitly sort by rank (Order of Difficulty)
        candidateWords.sort((a, b) => a.rank - b.rank);

        // Take the top N
        const newWords = candidateWords.slice(0, limit);

        for (const card of newWords) {
            queue.push({ card, progress: initializeWordProgress(card.id) });
        }

        return queue;
    }

    /**
     * Generates a session queue for REVIEW words only.
     */
    async getReviewQueue(limit: number = 10): Promise<{ card: VocabularyCard; progress?: WordProgress }[]> {
        const now = Date.now();

        // Get Due Reviews
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

        return queue;
    }

    /**
     * Generates a mixed session queue (Fallback / Legacy)
     */
    async getSessionQueue(limit: number = 10, targetLevel: CEFRLevel = 'A1'): Promise<{ card: VocabularyCard; progress?: WordProgress }[]> {
        // 1. Get Reviews First
        const reviews = await this.getReviewQueue(limit);
        if (reviews.length >= limit) return reviews;

        // 2. Fill with New Words
        const remaining = limit - reviews.length;
        const newWords = await this.getNewWordsQueue(remaining, targetLevel);

        return [...reviews, ...newWords];
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

        // Sync to Cloud if logged in
        if (auth.currentUser) {
            SyncService.pushProgress(auth.currentUser.uid, updatedProgress);
        }
    }

    /**
     * Resets progress for a specific word (Testing utility)
     */
    async resetWord(wordId: string): Promise<void> {
        await db.progress.delete(wordId);
    }

    /**
     * Counts the total number of words the user has started learning.
     */
    async getLearnedWordsCount(): Promise<number> {
        return await db.progress.count();
    }
}

export const wordsRepo = new WordsRepository();
