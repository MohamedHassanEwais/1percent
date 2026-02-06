import { db as firestore, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useUserStore } from "@/core/store/user-store";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

export const useFirestoreSync = () => {
    const { xp, level, streak, milestones } = useUserStore();

    // 1. Listen for Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("User authenticated, sinking with cloud...");
                await syncFromCloud(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. Push Local Changes to Cloud (Debounced ideally, but simple effect for now)
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(firestore, "users", user.uid);
            setDoc(userRef, {
                xp,
                level,
                streak,
                milestones,
                lastSynced: new Date()
            }, { merge: true });
        }
    }, [xp, level, streak, milestones]);
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
