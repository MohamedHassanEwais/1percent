"use client";

import { useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { SyncService } from "./sync-service";
import { useUserStore } from "@/core/store/user-store";

/**
 * SyncProvider — "Write Once" Strategy
 * 
 * Triggers a full sync ONLY when:
 * 1. App goes to background (visibilitychange → hidden)
 * 2. User logs out (via settings)
 * 3. Fallback timer every 6 hours (for users who never close the tab)
 * 
 * NO writes happen during active usage. Zero Firestore cost while studying.
 */
export function SyncProvider() {
    const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { user } = useUserStore();

    useEffect(() => {
        // Only set up listeners if user is authenticated
        if (!user.uid || !auth.currentUser) return;

        // 1. VISIBILITY CHANGE — sync when app goes to background/tab switches
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                console.log("[SyncProvider] App went to background. Triggering sync...");
                SyncService.fullSync();
            }
        };

        // 2. BEFORE UNLOAD — sync when tab/browser is closing
        const handleBeforeUnload = () => {
            // Note: async operations may not complete here, but we try anyway.
            // The visibilitychange event (above) fires first and is more reliable.
            SyncService.fullSync();
        };

        // 3. FALLBACK TIMER — sync every 6 hours for always-on tabs
        const SIX_HOURS = 6 * 60 * 60 * 1000;
        fallbackTimerRef.current = setInterval(() => {
            console.log("[SyncProvider] 6-hour fallback timer triggered.");
            SyncService.fullSync();
        }, SIX_HOURS);

        // Register listeners
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);

        console.log("[SyncProvider] ✅ Smart sync listeners registered.");

        // Cleanup on unmount
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            if (fallbackTimerRef.current) {
                clearInterval(fallbackTimerRef.current);
            }
        };
    }, [user.uid]);

    return null; // Logic only, no UI
}
