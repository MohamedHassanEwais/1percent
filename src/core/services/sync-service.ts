import { db as firestore, auth } from "@/lib/firebase";
import { db as localDb } from "@/lib/db/dexie";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUserStore } from "@/core/store/user-store";
import { WordProgress } from "../domain/types";

/**
 * Smart Sync Service — "Write Once" Strategy
 * 
 * - Dexie (IndexedDB) is the primary data source
 * - Firestore is a cloud backup — written ONCE when the app goes to background
 * - All word progress is stored as a compressed Map inside the user document (no subcollection)
 * - This keeps us within Firebase free tier: 1 read (login) + 1 write (close) per user per day
 */
export class SyncService {

    private static lastSyncTime = 0;
    private static MIN_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes minimum between syncs
    private static isSyncing = false;

    /**
     * FULL SYNC — Writes everything (profile + all word progress) to a single Firestore document.
     * Called on: app background, logout, manual sync, or 6-hour fallback timer.
     */
    static async fullSync(): Promise<boolean> {
        const currentUser = auth.currentUser;
        const store = useUserStore.getState();
        
        if (!currentUser || !store.user.uid) {
            console.log("[SyncService] Skipped: No authenticated user.");
            return false;
        }

        // Rate limit: don't sync more than once every 5 minutes
        const now = Date.now();
        if (now - this.lastSyncTime < this.MIN_SYNC_INTERVAL) {
            console.log("[SyncService] Skipped: Rate limited (last sync was < 5 min ago).");
            return false;
        }

        // Prevent concurrent syncs
        if (this.isSyncing) {
            console.log("[SyncService] Skipped: Already syncing.");
            return false;
        }

        this.isSyncing = true;

        try {
            // 1. Read all word progress from local Dexie
            const allProgress = await localDb.progress.toArray();

            // 2. Compress into a Map (short keys to save space)
            // s=status, n=nextReview, i=interval, e=easeFactor, r=repetitions
            const wordProgressMap: Record<string, { s: string; n: number; i: number; e: number; r: number }> = {};

            for (const p of allProgress) {
                wordProgressMap[p.wordId] = {
                    s: p.status,
                    n: p.nextReview,
                    i: p.interval,
                    e: Math.round(p.easeFactor * 100) / 100, // 2 decimal places
                    r: p.repetitions,
                };
            }

            // 3. Build the full document payload
            const payload = {
                // Profile
                xp: store.xp,
                level: store.level,
                streak: store.streak,
                milestones: store.milestones,
                targetLevel: store.targetLevel,
                maxUnlockedLevel: store.maxUnlockedLevel,
                focusHours: store.focusHours,
                efficiencyScore: store.efficiencyScore,
                displayName: store.user.displayName || currentUser.displayName || "مجهول",
                email: store.user.email || currentUser.email || null,
                photoURL: store.user.photoURL || currentUser.photoURL || null,

                // Word Progress (compressed map)
                wordProgress: wordProgressMap,

                // Metadata
                lastSynced: new Date().toISOString(),
                progressCount: allProgress.length,
            };

            // 4. Write ONCE to Firestore (merge to preserve any fields we don't track)
            const userRef = doc(firestore, "users", currentUser.uid);
            await setDoc(userRef, payload, { merge: true });

            this.lastSyncTime = now;
            console.log(`[SyncService] ✅ Full sync complete. ${allProgress.length} words synced.`);
            return true;

        } catch (error) {
            console.error("[SyncService] ❌ Full sync failed:", error);
            return false;

        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * PULL ALL — Reads the single user document from Firestore and restores to local Dexie.
     * Called on: login only (via InitializationService).
     */
    static async pullAll(uid: string): Promise<void> {
        if (!uid) return;

        try {
            console.log("[SyncService] Pulling cloud data...");
            const userRef = doc(firestore, "users", uid);
            const snap = await getDoc(userRef);

            if (!snap.exists()) {
                console.log("[SyncService] No cloud data found for user.");
                return;
            }

            const data = snap.data();

            // 1. Restore profile (cloud wins if higher XP)
            const store = useUserStore.getState();
            if (data.xp > store.xp) {
                useUserStore.setState({
                    xp: data.xp,
                    level: data.level,
                    streak: data.streak,
                    milestones: data.milestones || [],
                    targetLevel: data.targetLevel || store.targetLevel,
                    maxUnlockedLevel: data.maxUnlockedLevel || store.maxUnlockedLevel,
                    focusHours: data.focusHours || store.focusHours,
                    efficiencyScore: data.efficiencyScore || store.efficiencyScore,
                });
                console.log("[SyncService] ✅ Restored profile from cloud (cloud XP was higher).");
            }

            // 2. Restore word progress from the compressed map
            const wordProgress = data.wordProgress;
            if (wordProgress && typeof wordProgress === "object") {
                const progressEntries: WordProgress[] = Object.entries(wordProgress).map(
                    ([wordId, val]: [string, any]) => ({
                        wordId,
                        status: val.s || "new",
                        nextReview: val.n || 0,
                        interval: val.i || 0,
                        easeFactor: val.e || 2.5,
                        repetitions: val.r || 0,
                        history: [], // We don't sync history to save space
                    })
                );

                // Bulk put into Dexie (overwrites local with cloud)
                if (progressEntries.length > 0) {
                    await localDb.progress.bulkPut(progressEntries);
                    console.log(`[SyncService] ✅ Restored ${progressEntries.length} word progress entries from cloud.`);
                }
            }

        } catch (error) {
            console.error("[SyncService] ❌ Pull failed:", error);
        }
    }
}
