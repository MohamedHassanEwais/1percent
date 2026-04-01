import { db } from "@/lib/db/dexie";
import { useUserStore } from "@/core/store/user-store";
import { useNotificationStore } from "@/core/store/notification-store";

/**
 * NotificationService — Smart browser & in-app notifications
 * 
 * Browser notifications: daily reminders, streak protection, review due
 * In-app toasts: level up, achievements, streak milestones
 */
export class NotificationService {
    private static reminderTimer: ReturnType<typeof setTimeout> | null = null;
    private static streakCheckTimer: ReturnType<typeof setInterval> | null = null;

    // ═══════════════════════════════════════════════
    // 1. BROWSER NOTIFICATION PERMISSION
    // ═══════════════════════════════════════════════

    static async requestPermission(): Promise<boolean> {
        if (!("Notification" in window)) {
            console.warn("[Notif] Browser doesn't support notifications.");
            return false;
        }

        if (Notification.permission === "granted") return true;
        if (Notification.permission === "denied") return false;

        const result = await Notification.requestPermission();
        return result === "granted";
    }

    static get isPermissionGranted(): boolean {
        return typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted";
    }

    // ═══════════════════════════════════════════════
    // 2. BROWSER NOTIFICATIONS (push-style)
    // ═══════════════════════════════════════════════

    private static sendBrowserNotification(title: string, body: string, icon = "🎯") {
        if (!this.isPermissionGranted) return;

        try {
            new Notification(title, {
                body,
                icon: "/icon.png",
                badge: "/icon.png",
                tag: "delta-leap", // Replaces previous notification
                silent: false,
            });
        } catch (e) {
            console.warn("[Notif] Failed to send browser notification:", e);
        }
    }

    // ═══════════════════════════════════════════════
    // 3. DAILY REMINDER
    // ═══════════════════════════════════════════════

    static scheduleDailyReminder(hour: number, minute: number) {
        if (this.reminderTimer) clearTimeout(this.reminderTimer);

        const scheduleNext = () => {
            const now = new Date();
            const target = new Date();
            target.setHours(hour, minute, 0, 0);

            // If target time has passed today, schedule for tomorrow
            if (target <= now) {
                target.setDate(target.getDate() + 1);
            }

            const msUntilReminder = target.getTime() - now.getTime();

            this.reminderTimer = setTimeout(() => {
                this.sendBrowserNotification(
                    "⏰ وقت التعلم!",
                    "جلسة قصيرة اليوم تحافظ على تقدمك. هيا نبدأ! 🚀"
                );
                // Reschedule for tomorrow
                scheduleNext();
            }, msUntilReminder);

            console.log(`[Notif] Daily reminder scheduled in ${Math.round(msUntilReminder / 60000)} minutes.`);
        };

        scheduleNext();
    }

    static cancelDailyReminder() {
        if (this.reminderTimer) {
            clearTimeout(this.reminderTimer);
            this.reminderTimer = null;
            console.log("[Notif] Daily reminder cancelled.");
        }
    }

    // ═══════════════════════════════════════════════
    // 4. STREAK PROTECTION (checks every hour)
    // ═══════════════════════════════════════════════

    static startStreakProtection() {
        if (this.streakCheckTimer) return; // Already running

        const ONE_HOUR = 60 * 60 * 1000;

        this.streakCheckTimer = setInterval(() => {
            this.checkStreakRisk();
        }, ONE_HOUR);

        // Also check immediately
        this.checkStreakRisk();
    }

    static stopStreakProtection() {
        if (this.streakCheckTimer) {
            clearInterval(this.streakCheckTimer);
            this.streakCheckTimer = null;
        }
    }

    private static checkStreakRisk() {
        const { streak, lastStudyDate } = useUserStore.getState();

        // Only protect meaningful streaks (> 2 days)
        if (streak <= 2) return;

        const now = new Date();
        const today = now.toISOString().split("T")[0];

        // User already studied today? No risk.
        if (lastStudyDate === today) return;

        // It's after 8 PM and user hasn't studied? Send warning!
        if (now.getHours() >= 20) {
            this.sendBrowserNotification(
                `🔥 حماية الـ Streak (${streak} يوم)!`,
                "لسه ما تعلمت النهاردة! جلسة سريعة تحافظ على سلسلتك 💪"
            );
        }
    }

    // ═══════════════════════════════════════════════
    // 5. REVIEW DUE CHECK
    // ═══════════════════════════════════════════════

    static async checkDueReviews() {
        try {
            const now = Date.now();
            const dueCount = await db.progress
                .where("nextReview")
                .belowOrEqual(now)
                .count();

            if (dueCount >= 10) {
                this.sendBrowserNotification(
                    `📚 ${dueCount} بطاقة مستحقة!`,
                    "بطاقاتك جاهزة للمراجعة. لا تخليها تتراكم!"
                );
            }
        } catch (e) {
            console.warn("[Notif] Failed to check due reviews:", e);
        }
    }

    // ═══════════════════════════════════════════════
    // 6. IN-APP SMART TRIGGERS
    // ═══════════════════════════════════════════════

    static triggerLevelUp(newLevel: number) {
        useNotificationStore.getState().addNotification({
            type: "levelup",
            title: `مستوى ${newLevel}! 🎉`,
            message: "مبروك! وصلت لمستوى جديد. واصل التعلم!",
            emoji: "⬆️",
            duration: 5000,
        });
    }

    static triggerStreakMilestone(streak: number) {
        if (streak % 7 !== 0) return; // Only every 7 days

        useNotificationStore.getState().addNotification({
            type: "streak",
            title: `🔥 ${streak} يوم متواصل!`,
            message: "أنت على نار! استمر في هذا الزخم الرائع.",
            emoji: "🔥",
            duration: 6000,
        });
    }

    static triggerAchievement(title: string) {
        useNotificationStore.getState().addNotification({
            type: "achievement",
            title: `🏆 إنجاز جديد!`,
            message: title,
            emoji: "🏆",
            duration: 6000,
        });
    }

    static triggerXpMilestone(xp: number) {
        // Notify at round numbers: 1000, 5000, 10000, etc.
        const milestones = [1000, 5000, 10000, 25000, 50000];
        if (!milestones.includes(xp)) return;

        useNotificationStore.getState().addNotification({
            type: "success",
            title: `⚡ ${xp.toLocaleString()} XP!`,
            message: "وصلت لعلامة فارقة في رحلتك!",
            emoji: "⚡",
            duration: 5000,
        });
    }
}
