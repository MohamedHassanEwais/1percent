"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserStore } from "@/core/store/user-store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { syncUser, logout } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Apps script or console log for debugging
                console.log("Auth State: User Logged In", user.email);
                syncUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                });
            } else {
                console.log("Auth State: User Logged Out");
                logout();
            }
        });

        return () => unsubscribe();
    }, [syncUser, logout]);

    return <>{children}</>;
}
