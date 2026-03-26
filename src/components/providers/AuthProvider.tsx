"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserStore } from "@/core/store/user-store";
import { UserService } from "@/core/services/user-service";
import { SyncService } from "@/core/services/sync-service";
import { InitializationService } from "@/core/services/initialization-service";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { syncUser, setUserData, logout } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Auth Provider: Fetching Cloud Data for", user.email);

                // 1. Delegate Initialization
                try {
                    const { userProfile } = await InitializationService.initializeUser(user);

                    // 2. Update Store
                    setUserData(userProfile);
                } catch (err) {
                    console.error("Auth Provider: Initialization failed", err);
                    // Optional: Set global error state or logout if critical
                }

            } else {
                logout();
            }
        });

        return () => unsubscribe();
    }, [syncUser, setUserData, logout]);

    return <>{children}</>;
}
