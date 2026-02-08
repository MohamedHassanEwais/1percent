import { db as firestore } from "@/lib/firebase";
import { db as localDb } from "@/lib/db/dexie";
import { doc, getDocs, collection, setDoc, writeBatch } from "firebase/firestore";
import { WordProgress } from "../domain/types";

export class SyncService {
    private static COLLECTION = "progress";

    /**
     * Uploads a single word's progress to Firestore.
     * Call this after a local review is submitted.
     */
    static async pushProgress(uid: string, progress: WordProgress) {
        if (!uid) return;

        try {
            const docRef = doc(firestore, `users/${uid}/${this.COLLECTION}`, progress.wordId);
            // We only save the essential SRS data to save bandwidth/storage
            const payload = {
                wordId: progress.wordId,
                status: progress.status,
                nextReview: progress.nextReview,
                interval: progress.interval,
                easeFactor: progress.easeFactor,
                repetitions: progress.repetitions,
                lastSynced: Date.now()
            };
            await setDoc(docRef, payload);
        } catch (error) {
            console.error("SyncService: Failed to push progress", error);
        }
    }

    /**
     * Downloads ALL progress from Firestore and overwrites local data.
     * Call this on login.
     */
    static async pullProgress(uid: string) {
        if (!uid) return;

        try {
            console.log("SyncService: Pulling cloud data...");
            const querySnapshot = await getDocs(collection(firestore, `users/${uid}/${this.COLLECTION}`));

            if (querySnapshot.empty) {
                console.log("SyncService: No cloud data found.");
                return;
            }

            const cloudProgress: WordProgress[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                cloudProgress.push({
                    wordId: data.wordId,
                    status: data.status,
                    nextReview: data.nextReview,
                    interval: data.interval,
                    easeFactor: data.easeFactor,
                    repetitions: data.repetitions,
                    history: [] // We don't sync full history log to save space/complexity for now
                });
            });

            // Bulk put into Dexie (Overwrite)
            await localDb.progress.bulkPut(cloudProgress);
            console.log(`SyncService: Pulled ${cloudProgress.length} items from cloud.`);

        } catch (error) {
            console.error("SyncService: Failed to pull progress", error);
        }
    }
}
