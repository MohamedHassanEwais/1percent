import { db as firestore, auth } from "@/lib/firebase";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useUserStore } from "@/core/store/user-store";

/**
 * Pulls profile data from Firestore on login.
 * Called by InitializationService or directly after auth state change.
 * Uses "cloud wins if higher XP" conflict resolution.
 */
export async function syncFromCloud(uid: string) {
    const userRef = doc(firestore, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        const data = snap.data();
        const store = useUserStore.getState();

        // Cloud wins if it has more XP (prevents overwriting cloud with empty local state on new device)
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
            console.log("[FirestoreSync] ✅ Restored progress from cloud (cloud had more XP).");
        } else {
            console.log("[FirestoreSync] Local data is ahead or equal, keeping local.");
        }
    }
}

export const FirestoreSyncService = {
    async getGlobalLeaderboard(limitCount = 50) {
        try {
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, orderBy("xp", "desc"), limit(limitCount));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[];
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            return [];
        }
    }
};
