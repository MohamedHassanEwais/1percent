import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    intensity?: "low" | "medium" | "high";
    glow?: "none" | "lime" | "violet";
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, intensity = "medium", glow = "none", children, ...props }, ref) => {

        const bgOpacity = intensity === "low" ? "bg-white/[0.02]" : intensity === "high" ? "bg-white/[0.1]" : "bg-white/[0.05]";

        const glowClass = glow === "lime"
            ? "shadow-neon-lime border-brand-primary/30"
            : glow === "violet"
                ? "shadow-neon-violet border-brand-secondary/30"
                : "border-white/10";

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "rounded-2xl border backdrop-blur-xl transition-colors",
                    bgOpacity,
                    glowClass,
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
GlassCard.displayName = "GlassCard";
