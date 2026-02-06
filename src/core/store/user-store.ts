import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
    xp: number;
    level: number;
    streak: number;
    nextLevelXp: number;
    milestones: string[]; // IDs of unlocked milestones

    // Actions
    addXp: (amount: number) => void;
    incrementStreak: () => void;
    unlockMilestone: (id: string) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            streak: 0,
            nextLevelXp: 500,
            milestones: [],

            addXp: (amount) => set((state) => {
                const newXp = state.xp + amount;
                let newLevel = state.level;
                let newNextLevelXp = state.nextLevelXp;

                // Simple leveling logic
                if (newXp >= state.nextLevelXp) {
                    newLevel += 1;
                    newNextLevelXp = Math.floor(state.nextLevelXp * 1.5);
                    // Trigger level up animation/modal here? (Ideally via a separate event bus)
                }

                return { xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp };
            }),

            incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),

            unlockMilestone: (id) => set((state) => ({
                milestones: [...state.milestones, id]
            })),
        }),
        {
            name: 'user-storage', // unique name
            storage: createJSONStorage(() => localStorage), // Persist to localStorage
        }
    )
);
