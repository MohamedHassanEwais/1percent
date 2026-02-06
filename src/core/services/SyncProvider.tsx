"use client";

import { useFirestoreSync } from "./firestore-sync";

export function SyncProvider() {
    useFirestoreSync();
    return null; // Logic only, no UI
}
