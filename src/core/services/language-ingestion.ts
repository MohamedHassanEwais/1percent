import { db } from '../store/db';
import { LanguageCoreSchema, type LanguageCore } from '../schema/language-schema';

export class LanguageIngestionService {
    /**
     * Parse and ingest a new language JSON file
     */
    static async ingestLanguage(jsonData: unknown) {
        // Validate with Zod
        const parsed = LanguageCoreSchema.parse(jsonData);

        // Map to Dexie.js
        await db.transaction('rw', db.core_words, async () => {
            // Clearing the DB for simplicity, but could be merge logic
            await db.core_words.clear();
            await db.core_words.bulkAdd(parsed.items);
        });

        console.log(`Ingested language: ${parsed.language} v${parsed.version}`);
        console.log(`Total items ingested: ${parsed.items.length}`);
    }
}
