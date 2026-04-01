"use client";

import { useNotificationStore, NotificationType } from "@/core/store/notification-store";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const TYPE_STYLES: Record<NotificationType, { bg: string; border: string; glow: string }> = {
    success:     { bg: "bg-green-500/10", border: "border-green-500/30", glow: "shadow-[0_0_20px_rgba(34,197,94,0.15)]" },
    warning:     { bg: "bg-orange-500/10", border: "border-orange-500/30", glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]" },
    info:        { bg: "bg-blue-500/10",   border: "border-blue-500/30",   glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
    achievement: { bg: "bg-accent/10",     border: "border-accent/30",     glow: "shadow-[0_0_25px_rgba(250,250,51,0.2)]" },
    levelup:     { bg: "bg-purple-500/10", border: "border-purple-500/30", glow: "shadow-[0_0_25px_rgba(168,85,247,0.2)]" },
    streak:      { bg: "bg-orange-500/10", border: "border-orange-500/30", glow: "shadow-[0_0_25px_rgba(249,115,22,0.2)]" },
};

export function ToastContainer() {
    const { notifications, dismissNotification } = useNotificationStore();

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-sm px-4 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {notifications.map((notif) => {
                    const style = TYPE_STYLES[notif.type];
                    return (
                        <motion.div
                            key={notif.id}
                            layout
                            initial={{ opacity: 0, y: -40, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 350 }}
                            className={`pointer-events-auto ${style.bg} ${style.border} ${style.glow} border backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3`}
                        >
                            {/* Emoji */}
                            {notif.emoji && (
                                <span className="text-2xl flex-shrink-0 mt-0.5">{notif.emoji}</span>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0" dir="rtl">
                                <p className="text-white font-bold text-sm leading-tight">{notif.title}</p>
                                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{notif.message}</p>
                            </div>

                            {/* Dismiss */}
                            <button
                                onClick={() => dismissNotification(notif.id)}
                                className="flex-shrink-0 text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
