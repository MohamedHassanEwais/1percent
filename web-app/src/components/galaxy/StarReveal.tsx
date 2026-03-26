import { motion } from "framer-motion";
import { useEffect } from "react";

interface StarRevealProps {
    onComplete: () => void;
}

export function StarReveal({ onComplete }: StarRevealProps) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1, rotate: [0, 180, 360] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative"
            >
                {/* The Star */}
                <div className="h-40 w-40 rounded-full bg-[#CCFF00] shadow-[0_0_100px_#CCFF00] animate-pulse" />

                {/* Rays */}
                <div className="absolute inset-0 -z-10 animate-[spin_4s_linear_infinite]">
                    <div className="h-full w-full border-[20px] border-dashed border-[#CCFF00]/20 rounded-full" />
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center text-2xl font-black uppercase text-white whitespace-nowrap"
                >
                    New Node Discovered!
                </motion.h2>
            </motion.div>
        </div>
    );
}
