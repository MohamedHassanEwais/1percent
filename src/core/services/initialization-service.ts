import { db } from "@/lib/db/dexie";
import { SyncService } from "./sync-service";
import { UserService } from "./user-service";
import { User } from "firebase/auth";

export class InitializationService {
    static async initializeUser(firebaseUser: User) {
        console.log("Init Service: Starting initialization for", firebaseUser.email);

        // 1. Sync Basic Info
        // We can do this optimistically or await it. Awaiting ensures consistency.
        // We might want to use the store's action, but here we can use the service directly if needed,
        // or return data for the store to use.
        // Let's return the data payload that the store needs.

        try {
            // Parallelize independent operations if possible
            // SyncService.pullProgress is heavy, maybe start it but don't block UI if not needed immediately?
            // Actually, for "Offline Access" reliability, we might want to ensure we have data.
            // But let's prioritize getting the user profile first.

            // A. Get User Profile from Firestore (or creates it)
            // We'll trust UserService to handle the "create if not exists" logic 
            // but the original code had it explicit. Let's encapsulate it here.

            let userProfile = await UserService.getUserData(firebaseUser.uid);

            if (!userProfile) {
                console.log("Init Service: Creating new user profile...");
                userProfile = await UserService.createUserData({
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL
                });
            } else {
                console.log("Init Service: Loaded existing user profile.");
            }

            // B. Trigger Background Sync
            // We don't necessarily need to await this to show the dashboard, 
            // but we SHOULD await it if we want the Galaxy/Stats to be accurate on first load.
            // Let's await it for now to avoid "pop-in" of data, but consider making it background later.
            await SyncService.pullProgress(firebaseUser.uid);

            return {
                userProfile,
                // We could return other initial state here if needed
            };

        } catch (error) {
            console.error("Init Service: Initialization failed", error);
            throw error;
        }
    }
}
