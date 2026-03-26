import { db as firestore, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useUserStore } from "@/core/store/user-store";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

export const useFirestoreSync = () => {
    const { xp, level, streak, milestones, user } = useUserStore();

    // 1. Listen for Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                console.log("User authenticated, sinking with cloud...");
                await syncFromCloud(authUser.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. Push Local Changes to Cloud (Debounced ideally, but simple effect for now)
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userRef = doc(firestore, "users", currentUser.uid);
            setDoc(userRef, {
                xp,
                level,
                streak,
                milestones,
                displayName: user.displayName || currentUser.displayName || "Anonymous",
                photoURL: user.photoURL || currentUser.photoURL || null,
                lastSynced: new Date()
            }, { merge: true });
        }
    }, [xp, level, streak, milestones, user.displayName, user.photoURL]);
};

async function syncFromCloud(uid: string) {
    const userRef = doc(firestore, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        const data = snap.data();
        const store = useUserStore.getState();

        // Simple Conflict Resolution: Cloud wins if it has more XP
        // (Prevents overwriting cloud progress with empty local state on new device)
        if (data.xp > store.xp) {
            useUserStore.setState({
                xp: data.xp,
                level: data.level,
                streak: data.streak,
                milestones: data.milestones || []
            });
            console.log("Restored progress from cloud.");
        }
    }
}

export const SyncService = {
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
    },

    // Legacy mapping if needed
    pushProgress: async (uid: string, progress: any) => {
        // We might implement detailed progress sync later, currently words-repo handles it via db.progress
    }
};
