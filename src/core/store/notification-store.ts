import { create } from 'zustand';

export type NotificationType = 'success' | 'warning' | 'info' | 'achievement' | 'levelup' | 'streak';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    emoji?: string;
    autoDismiss?: boolean;
    duration?: number; // ms
}

interface NotificationState {
    notifications: AppNotification[];
    addNotification: (notification: Omit<AppNotification, 'id'>) => void;
    dismissNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
    notifications: [],

    addNotification: (notification) => {
        const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newNotif: AppNotification = {
            id,
            autoDismiss: true,
            duration: 4000,
            ...notification,
        };

        set((state) => ({
            notifications: [...state.notifications, newNotif],
        }));

        // Auto-dismiss
        if (newNotif.autoDismiss) {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                }));
            }, newNotif.duration);
        }
    },

    dismissNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    clearAll: () => set({ notifications: [] }),
}));
