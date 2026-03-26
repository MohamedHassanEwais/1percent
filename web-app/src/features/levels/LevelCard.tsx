import { motion } from 'framer-motion';
import { Lock, Unlock, Star, BookOpen, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CEFRLevel } from '@/core/domain/types';

interface LevelCardProps {
    level: CEFRLevel;
    title: string;
    description: string;
    isLocked: boolean;
    progress: number; // 0 to 100
    totalWords: number;
    onSelect: (level: CEFRLevel) => void;
}

export function LevelCard({ level, title, description, isLocked, progress, totalWords, onSelect }: LevelCardProps) {
    return (
        <motion.div
            whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "relative overflow-hidden rounded-2xl p-6 border transition-all duration-300",
                isLocked
                    ? "bg-zinc-900 border-zinc-800 opacity-70 cursor-not-allowed"
                    : "bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border-zinc-700 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] cursor-pointer group"
            )}
            onClick={() => !isLocked && onSelect(level)}
            aria-disabled={isLocked}
        >
            {/* Background Gradient Blob */}
            {!isLocked && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-violet-600/20 transition-all" />
            )}

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border",
                    isLocked
                        ? "bg-zinc-800 border-zinc-700 text-zinc-500"
                        : "bg-violet-500/10 border-violet-500/30 text-violet-400 group-hover:bg-violet-500/20"
                )}>
                    {level}
                </div>
                <div className="text-zinc-500">
                    {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5 text-emerald-500/80" />}
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-violet-200 transition-colors">{title}</h3>
            <p className="text-sm text-zinc-400 mb-6 h-10 line-clamp-2">{description}</p>

            {/* Stats Row */}
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-6">
                <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{totalWords} Words</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{progress}% Mastery</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                        "h-full rounded-full bg-gradient-to-r",
                        isLocked ? "from-zinc-700 to-zinc-600" : "from-violet-600 to-indigo-600"
                    )}
                />
            </div>

            {!isLocked && progress === 100 && (
                <div className="absolute bottom-4 right-4 text-yellow-500 animate-pulse">
                    <Star className="w-6 h-6 fill-current" />
                </div>
            )}
        </motion.div>
    );
}
