import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

const buttonVariants = cva(
    "relative inline-flex items-center justify-center rounded-lg font-heading text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground hover:shadow-neon-lime hover:bg-[#D4FF33]",
                secondary: "bg-secondary text-secondary-foreground hover:shadow-neon-violet hover:bg-[#8B5CF6]",
                outline: "border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary hover:shadow-neon-lime",
                ghost: "text-slate-400 hover:text-white hover:bg-white/5",
                danger: "bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            },
            size: {
                default: "h-12 px-6 py-2",
                sm: "h-9 px-4 text-xs",
                lg: "h-14 px-8 text-base",
                icon: "h-10 w-10",
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        }
    }
);

interface NeonButtonProps extends Omit<HTMLMotionProps<"button">, "ref">, VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    asChild?: boolean;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, variant, size, isLoading, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(buttonVariants({ variant, size, className }))}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    children
                )}
            </motion.button>
        );
    }
);
NeonButton.displayName = "NeonButton";
