"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserStore } from "@/core/store/user-store";
import { UserService } from "@/core/services/user-service";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { syncUser, setUserData, logout } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Auth Provider: Fetching Cloud Data for", user.email);

                // 1. Sync Basic Info
                syncUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                });

                // 2. Fetch/Create Cloud Data
                try {
                    // Sync Word Progress (Deep Sync)
                    await SyncService.pullProgress(user.uid);

                    let firestoreData = await UserService.getUserData(user.uid);

                    if (!firestoreData) {
                        console.log("Auth Provider: Creating new user profile...");
                        firestoreData = await UserService.createUserData({
                            uid: user.uid,
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL
                        });
                    } else {
                        console.log("Auth Provider: Loaded existing user profile.");
                    }

                    // 3. Update Store with Cloud Data
                    setUserData(firestoreData);

                } catch (err) {
                    console.error("Auth Provider Error:", err);
                }

            } else {
                logout();
            }
        });

        return () => unsubscribe();
    }, [syncUser, setUserData, logout]);

    return <>{children}</>;
}
