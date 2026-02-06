import Dexie, { type EntityTable } from 'dexie';
import { VocabularyCard, WordProgress, UserProfile } from '../../core/domain/types';

const db = new Dexie('1percent_db') as Dexie & {
    words: EntityTable<VocabularyCard, 'id'>;
    progress: EntityTable<WordProgress, 'wordId'>;
    user: EntityTable<UserProfile, 'uid'>;
};

// Schema
db.version(1).stores({
    words: 'id, rank, level, normalized',
    progress: 'wordId, status, nextReview',
    user: 'uid'
});

export { db };

/**
 * seeding helper (for testing/dev)
 */
export async function seedDatabase(words: VocabularyCard[]) {
    const count = await db.words.count();
    if (count === 0) {
        await db.words.bulkAdd(words);
        console.log(`Seeded ${words.length} words to local DB.`);
    }
}
