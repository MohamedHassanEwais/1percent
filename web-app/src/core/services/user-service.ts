import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { CEFRLevel } from "../domain/types";

export interface UserProfileData {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    xp: number;
    level: number;
    streak: number;
    nextLevelXp: number;
    milestones: string[];
    targetLevel: CEFRLevel;
    maxUnlockedLevel: CEFRLevel;
    createdAt: string;
    lastLoginAt: string;
}

export class UserService {
    private static COLLECTION = "users";

    static async getUserData(uid: string): Promise<UserProfileData | null> {
        try {
            const docRef = doc(db, this.COLLECTION, uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfileData;
                return {
                    ...data,
                    maxUnlockedLevel: data.maxUnlockedLevel || 'A0' // Backfill for legacy
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    }

    static async createUserData(user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null }): Promise<UserProfileData> {
        const newUser: UserProfileData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            xp: 0,
            level: 1,
            streak: 0,
            nextLevelXp: 500,
            milestones: [],
            targetLevel: 'A1',
            maxUnlockedLevel: 'A0',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
        };

        try {
            await setDoc(doc(db, this.COLLECTION, user.uid), newUser);
            return newUser;
        } catch (error) {
            console.error("Error creating user data:", error);
            throw error;
        }
    }

    static async updateUserProgress(uid: string, data: Partial<UserProfileData>) {
        try {
            const docRef = doc(db, this.COLLECTION, uid);
            await updateDoc(docRef, {
                ...data,
                lastLoginAt: new Date().toISOString() // Update last interaction
            });
        } catch (error) {
            console.error("Error updating user progress:", error);
        }
    }
}
