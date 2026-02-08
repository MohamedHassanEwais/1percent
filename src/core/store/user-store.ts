import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CEFRLevel } from "@/core/domain/types";

interface UserState {
    xp: number;
    level: number;
    streak: number;
    nextLevelXp: number;
    milestones: string[]; // IDs of unlocked milestones

    // Preferences
    targetLevel: CEFRLevel;

    // User Profile Data
    user: {
        uid: string | null;
        displayName: string | null;
        email: string | null;
        photoURL: string | null;
    };

    // Gamification
    dailyGoal: number; // XP per day
    xpToday: number;
    lastStudyDate: string | null; // ISO Date string for streak logic

    // Actions
    setUserData: (data: { xp: number; level: number; streak: number; nextLevelXp: number; milestones: string[]; targetLevel: CEFRLevel; uid: string; displayName: string | null; email: string | null; photoURL: string | null }) => void;
    addXp: (amount: number) => void;
    incrementStreak: () => void;
    unlockMilestone: (id: string) => void;
    setTargetLevel: (level: CEFRLevel) => void;
    syncUser: (userData: { uid: string; displayName: string | null; email: string | null; photoURL: string | null }) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            streak: 0,
            nextLevelXp: 500,
            milestones: [],
            targetLevel: 'A1', // Default to beginner

            user: {
                uid: null,
                displayName: null,
                email: null,
                photoURL: null,
            },

            dailyGoal: 50, // Default 50 XP
            xpToday: 0,
            lastStudyDate: null,

            setUserData: (data) => set({
                xp: data.xp,
                level: data.level,
                streak: data.streak,
                nextLevelXp: data.nextLevelXp,
                milestones: data.milestones,
                targetLevel: data.targetLevel,
                user: {
                    uid: data.uid,
                    displayName: data.displayName,
                    email: data.email,
                    photoURL: data.photoURL
                }
            }),

            addXp: (amount) => set((state) => {
                const newXp = state.xp + amount;
                let newLevel = state.level;
                let newNextLevelXp = state.nextLevelXp;
                let newStreak = state.streak;
                let newLastStudyDate = state.lastStudyDate;
                let newXpToday = state.xpToday + amount;

                // Streak Logic
                const today = new Date().toISOString().split('T')[0];
                if (state.lastStudyDate !== today) {
                    // It's a new day
                    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

                    if (state.lastStudyDate === yesterday) {
                        // Continued streak
                        newStreak += 1;
                    } else if (state.lastStudyDate && state.lastStudyDate < yesterday) {
                        // Broken streak (if we want to reset)
                        newStreak = 1;
                    } else if (!state.lastStudyDate) {
                        // First day
                        newStreak = 1;
                    }

                    newLastStudyDate = today;
                    newXpToday = amount; // Reset for new day
                }

                // Leveling Logic
                if (newXp >= state.nextLevelXp) {
                    newLevel += 1;
                    newNextLevelXp = Math.floor(state.nextLevelXp * 1.5);
                }

                return {
                    xp: newXp,
                    level: newLevel,
                    nextLevelXp: newNextLevelXp,
                    streak: newStreak,
                    lastStudyDate: newLastStudyDate,
                    xpToday: newXpToday
                };
            }),

            incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),

            unlockMilestone: (id) => set((state) => ({
                milestones: [...state.milestones, id]
            })),

            setTargetLevel: (level) => set({ targetLevel: level }),

            syncUser: (userData) => set({ user: userData }),

            logout: () => set({
                user: { uid: null, displayName: null, email: null, photoURL: null },
                // Optional: reset other stats on logout? For now, we keep them as "local device stats" unless we sync to DB.
            }),
        }),
        {
            name: 'user-storage', // unique name
            storage: createJSONStorage(() => localStorage), // Persist to localStorage
        }
    )
);
