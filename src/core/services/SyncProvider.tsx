"use client";

import { useEffect, useRef } from "react";
import { auth, db as firestore } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useUserStore } from "@/core/store/user-store";

/**
 * SyncProvider: Auto-pushes user profile changes (XP, level, streak, etc.) 
 * to Firestore when the user is authenticated and the data has been initialized.
 * 
 * It uses a debounce to avoid spamming Firestore on every micro-change.
 * It also skips the initial push to prevent overwriting cloud data with local defaults.
 */
export function SyncProvider() {
    const { xp, level, streak, milestones, targetLevel, maxUnlockedLevel, user, focusHours, efficiencyScore } = useUserStore();
    const isInitialMount = useRef(true);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Skip the first render to prevent overwriting cloud data 
        // with initial/default values before AuthProvider has loaded cloud data.
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Only sync if user is authenticated
        const currentUser = auth.currentUser;
        if (!currentUser || !user.uid) return;

        // Debounce: wait 2 seconds after the last change before syncing
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(async () => {
            try {
                const userRef = doc(firestore, "users", currentUser.uid);
                await setDoc(userRef, {
                    xp,
                    level,
                    streak,
                    milestones,
                    targetLevel,
                    maxUnlockedLevel,
                    focusHours,
                    efficiencyScore,
                    displayName: user.displayName || currentUser.displayName || "مجهول",
                    email: user.email || currentUser.email || null,
                    photoURL: user.photoURL || currentUser.photoURL || null,
                    lastSynced: new Date().toISOString(),
                }, { merge: true });
                console.log("[SyncProvider] ✅ Pushed profile to Firestore");
            } catch (error) {
                console.error("[SyncProvider] Failed to push:", error);
            }
        }, 2000);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [xp, level, streak, milestones, targetLevel, maxUnlockedLevel, user, focusHours, efficiencyScore]);

    return null; // Logic only, no UI
}
