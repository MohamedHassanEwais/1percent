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
        const isFullSeeded = localStorage.getItem('is_full_data_seeded');

        // Force re-seed for full data update
        if (count === 0 || !isFullSeeded) {
            console.log("[WordsRepo] Seeding full dataset...");
            await this.seedDatabase(true);
            localStorage.setItem('is_full_data_seeded', 'true');
        }
    }

    /**
     * Fisher-Yates shuffle algorithm to randomize an array.
     */
    private shuffleArray<T>(array: T[]): T[] {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
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

        // 2. Seed Phonemes (Check if missing)
        // Phonemes have negative ranks (-44 to -1)
        const phonemeCheck = await db.words.where('rank').below(1).count();
        if (phonemeCheck === 0) {
            await this.seedPhonemes();
        }

        // 3. Seed Phrases (Add if missing)
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
                level: (item.level as CEFRLevel) || 'N/A',
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
        if (rank > 0) return 'A1'; // Ranks 1-500 are A1 (Reverting 50 logic)
        return 'A0'; // Negative Ranks are Phonemes (A0)
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


    private async seedPhonemes() {
        try {
            // Check if phonemes already exist
            const existing = await db.words.where('rank').below(1).count();
            if (existing > 0) return;

            const phonemeData = (await import("@/lib/data/seed_phonemes.json")).default;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const phonemes: VocabularyCard[] = phonemeData.map((item: any) => ({
                id: `phoneme_${item.word}`,
                word: item.word,
                normalized: item.word.toLowerCase(),
                rank: item.rank, // Negative Rank

                phonetic: item.phonetics || "",
                audioUrl: item.audio || "",
                translation: item.translation || "صوت",
                definition: item.definition || "",
                exampleSentence: item.exampleSentence || "",
                imageUrl: `https://source.unsplash.com/random/400x300/?abstract,geometric,sound`,

                pos: "phoneme",
                level: 'A0',
                tags: ['core']
            }));
            await db.words.bulkAdd(phonemes);
            console.log(`[WordsRepo] Seeded ${phonemes.length} phonemes.`);
        } catch (e) {
            console.warn("Phonemes seed file not found or failed:", e);
        }
    }

    /**
     * Generates a session queue for NEW words only.
     */
    async getNewWordsQueue(limit: number = 10, targetLevel: CEFRLevel = 'A0'): Promise<{ card: VocabularyCard; progress?: WordProgress }[]> {
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
            .filter(w => !progressIds.includes(w.id) && w.pos !== 'phrase')
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
    async getReviewQueue(limit: number = 10, targetLevel: CEFRLevel = 'N/A'): Promise<{ card: VocabularyCard; progress?: WordProgress }[]> {
        const now = Date.now();

        // Get Due Reviews
        const dueProgress = await db.progress
            .where('nextReview').belowOrEqual(now)
            .and(p => p.status !== 'new')
            .sortBy('nextReview');

        const queue: { card: VocabularyCard; progress?: WordProgress }[] = [];

        // Fetch card details for due items and filter by level
        for (const p of dueProgress) {
            if (queue.length >= limit) break;
            const card = await db.words.get(p.wordId);
            if (card) {
                // If targetLevel is provided and valid, filter by it
                if (targetLevel && targetLevel !== 'N/A' && card.level !== targetLevel) {
                    continue;
                }
                queue.push({ card, progress: p });
            }
        }

        return queue;
    }

    /**
     * Generates a mixed session queue (Words + Phrases) for a specific level with Smart Mix logic.
     */
    async getSessionQueue(limit: number = 10, targetLevel: CEFRLevel = 'A1'): Promise<{ card: VocabularyCard; progress?: WordProgress }[]> {
        // 1. Get Scheduled Reviews First (Priority - No Shuffle)
        const reviews = await this.getReviewQueue(limit, targetLevel);
        if (reviews.length >= limit) return reviews;

        // 2. Calculate Slots for New Content
        let remaining = limit - reviews.length;

        // Target mix: ~30% phrases, ~70% words
        const phraseGoal = Math.max(1, Math.floor(remaining * 0.3));

        // 3. Fetch New Phrases (Attempt 1)
        const newPhrases = await this.getNewPhrasesQueue(phraseGoal, targetLevel);
        remaining -= newPhrases.length;

        // 4. Fetch New Words (Filling the rest)
        const newWords = await this.getNewWordsQueue(remaining, targetLevel);
        remaining -= newWords.length;

        // 5. Bidirectional Fallback: If words ran out, try fetching MORE phrases to fill the final gap
        if (remaining > 0) {
            // Exclude already picked phrases to avoid duplicates
            const alreadyPickedIds = newPhrases.map(i => i.card.id);
            const extraPhrases = await this.getNewPhrasesQueue(remaining, targetLevel, alreadyPickedIds);
            newPhrases.push(...extraPhrases);
        }

        // 6. Combine and Shuffle New Content
        const allNewContent = [...newPhrases, ...newWords];
        const shuffledNewContent = this.shuffleArray(allNewContent);

        // 7. Return Reviews + Shuffled New
        return [...reviews, ...shuffledNewContent];
    }

    /**
     * Generates a session queue for NEW phrases only.
     */
    async getNewPhrasesQueue(limit: number = 3, targetLevel: CEFRLevel = 'A0', excludeIds: string[] = []): Promise<{ card: VocabularyCard; progress?: WordProgress }[]> {
        const queue: { card: VocabularyCard; progress?: WordProgress }[] = [];
        const progressIds = await db.progress.toCollection().primaryKeys();

        // Filter phrases by level
        let collection = db.words.orderBy('rank');

        if (targetLevel && targetLevel !== 'N/A') {
            collection = db.words.where('level').equals(targetLevel);
        }

        const candidates = await collection
            .filter(w => w.pos === 'phrase' && !progressIds.includes(w.id) && !excludeIds.includes(w.id))
            .toArray();

        // Sort by rank (if relevant)
        candidates.sort((a, b) => a.rank - b.rank);

        const selected = candidates.slice(0, limit);

        for (const card of selected) {
            queue.push({ card, progress: initializeWordProgress(card.id) });
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
     * Counts the total number of words the user has started learning, optionally by level.
     */
    async getLearnedWordsCount(level?: CEFRLevel): Promise<number> {
        if (!level || level === 'N/A') {
            return await db.progress.count();
        }

        // Join progress with words to filter by level
        // Dexie doesn't verify joins easily on count without fetching.
        // Optimized approach: Fetch all progress words, then count.
        // Or fetch all words of level, then count how many have progress.

        const levelWords = await db.words.where('level').equals(level).primaryKeys();

        // Count how many of these IDs exist in progress
        const learnedCount = await db.progress.where('wordId').anyOf(levelWords).count();

        return learnedCount;
    }

    /**
     * Checks if a level is considered "completed" (e.g. >95% words learned).
     */
    async isLevelComplete(level: CEFRLevel): Promise<boolean> {
        if (!level || level === 'N/A') return false;

        const totalWords = await db.words.where('level').equals(level).count();
        if (totalWords === 0) return false;

        const learnedCount = await this.getLearnedWordsCount(level);

        // Threshold: 95% of words started/learned
        return learnedCount >= (totalWords * 0.95);
    }
}

export const wordsRepo = new WordsRepository();
