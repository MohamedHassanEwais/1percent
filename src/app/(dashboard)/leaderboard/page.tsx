"use client";

import { useUserStore } from "@/core/store/user-store";
import { useEffect, useState } from "react";
import { Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

// Simulated "Elite" Competitors
const initialComputers = [
    { id: "comp-1", name: "محمد أحمد", xp: 15400, avatar: "https://i.pravatar.cc/150?img=11", isMe: false },
    { id: "comp-2", name: "سارة محمود", xp: 14200, avatar: "https://i.pravatar.cc/150?img=5", isMe: false },
    { id: "comp-3", name: "يوسف علي", xp: 13950, avatar: "https://i.pravatar.cc/150?img=3", isMe: false },
    { id: "comp-4", name: "نور الدين", xp: 9000, avatar: "https://i.pravatar.cc/150?img=8", isMe: false },
    { id: "comp-5", name: "ليلى حسن", xp: 8500, avatar: "https://i.pravatar.cc/150?img=9", isMe: false },
    { id: "comp-6", name: "عمر خالد", xp: 8100, avatar: "https://i.pravatar.cc/150?img=12", isMe: false },
    { id: "comp-7", name: "فاطمة سعيد", xp: 7200, avatar: "https://i.pravatar.cc/150?img=20", isMe: false },
];

export default function LeaderboardPage() {
    const { xp, user } = useUserStore();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [myRank, setMyRank] = useState(0);
    const [myUserObj, setMyUserObj] = useState<any>(null);

    useEffect(() => {
        const currentUser = {
            id: "me",
            name: user?.displayName || "أنت",
            xp: xp,
            avatar: user?.photoURL || "https://i.pravatar.cc/150?img=33",
            isMe: true,
        };

        const allUsers = [...initialComputers, currentUser];
        allUsers.sort((a, b) => b.xp - a.xp);

        const rankedUsers = allUsers.map((u, index) => ({
            ...u,
            rank: index + 1
        }));

        setLeaderboard(rankedUsers);
        const myIndex = rankedUsers.findIndex(u => u.isMe);
        setMyRank(myIndex + 1);
        setMyUserObj(rankedUsers[myIndex]);
    }, [xp, user]);

    // In RTL, the array order [rank2, rank1, rank3] places Rank 2 on Right, Rank 1 Center, Rank 3 Left
    const podiumMap = [
        leaderboard.find(u => u.rank === 2),
        leaderboard.find(u => u.rank === 1),
        leaderboard.find(u => u.rank === 3)
    ];

    const restList = leaderboard.filter(u => u.rank > 3);

    return (
        <main className="bg-black min-h-screen text-white font-sans overflow-hidden flex flex-col rtl relative" dir="rtl">
            
            {/* Top Bar (Handled partly by Layout, but let's add the title here just in case) */}
            <div className="flex items-center justify-center pt-6 pb-2 shrink-0 z-20 bg-black">
                <h2 className="text-white text-xl font-bold leading-tight tracking-tight">لوحة الصدارة</h2>
            </div>

            {/* Main Scrollable List */}
            <div className="flex-1 overflow-y-auto pb-40 bg-black relative scrollbar-hide">
                
                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                    <div className="flex justify-center items-end gap-4 py-8 px-4">
                        {podiumMap.map((user, idx) => {
                            if (!user) return null;
                            const isRank1 = user.rank === 1;
                            const isRank2 = user.rank === 2;
                            const isRank3 = user.rank === 3;
                            
                            // Color mapping
                            const ringColor = isRank1 ? 'border-accent shadow-[0_0_30px_rgba(250,250,51,0.6)]' 
                                            : isRank2 ? 'border-gray-400 shadow-[0_0_20px_rgba(192,192,192,0.4)]'
                                            : 'border-amber-700 shadow-[0_0_20px_rgba(205,127,50,0.4)]';
                            const badgeColor = isRank1 ? 'bg-accent text-black' 
                                             : isRank2 ? 'bg-gray-400 text-black' 
                                             : 'bg-amber-700 text-black';
                            const size = isRank1 ? 'w-24 h-24' : 'w-20 h-20';
                            const marginTop = isRank1 ? '-mt-8' : '';

                            return (
                                <div key={user.id} className={`flex flex-col items-center gap-2 ${marginTop}`}>
                                    <div className="relative group">
                                        <div className={`absolute -inset-1 rounded-full blur opacity-80 animate-pulse ${isRank1 ? 'bg-accent' : isRank2 ? 'bg-gray-400' : 'bg-amber-700'}`}></div>
                                        <div className={`relative ${size} rounded-full border-[3px] p-1 bg-black ${ringColor}`}>
                                            <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                                            
                                            {isRank1 && (
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-accent">
                                                    <Trophy fill="currentColor" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(250,250,51,0.8)]" />
                                                </div>
                                            )}
                                            
                                            <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 ${badgeColor} text-xs font-bold px-3 py-1 rounded-full border-2 border-black`}>
                                                #{user.rank}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center mt-2">
                                        <p className={`font-bold text-sm ${isRank1 ? 'text-accent text-lg' : 'text-white'}`}>{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.xp.toLocaleString()} XP</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* List Items (Rank 4+) */}
                <div className="px-2 mt-4 space-y-2">
                    {restList.map((user) => (
                        <div key={user.id} className={`flex items-center gap-4 p-4 rounded-xl mx-2 transition-all ${user.isMe ? 'bg-white/10 border border-white/20' : 'bg-transparent border-b border-white/5'}`}>
                            <span className="text-gray-500 font-mono w-6 text-center">{user.rank}</span>
                            <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 shrink-0" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                            <div className="flex-1">
                                <p className="text-white text-base font-medium leading-none">{user.name} {user.isMe && '(أنت)'}</p>
                            </div>
                            <div className="text-gray-400 font-medium tabular-nums">{user.xp.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
                
                {/* Spacer so it doesn't collide with sticky nav */}
                <div className="h-6"></div>
            </div>

            {/* Sticky User Stats Bar */}
            {myUserObj && (
                <div className="fixed bottom-[80px] left-4 right-4 z-30">
                    <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 flex items-center gap-4">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
                        
                        <div className="flex flex-col items-center justify-center min-w-[3rem]">
                            <span className="text-[10px] text-accent font-bold uppercase tracking-wider">الترتيب</span>
                            <span className="text-white text-xl font-black">{myRank}</span>
                        </div>
                        
                        <div className="h-10 w-[1px] bg-white/20"></div>
                        
                        <div className="bg-center bg-no-repeat bg-cover rounded-full h-12 w-12 shrink-0 border-2 border-accent shadow-[0_0_15px_rgba(250,250,51,0.3)]" style={{ backgroundImage: `url(${myUserObj.avatar})` }}></div>
                        
                        <div className="flex-1 z-10">
                            <p className="text-white text-base font-bold leading-none">أنت</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-gray-300">أعلى 15%</span>
                                <TrendingUp className="text-green-400 w-3 h-3 rtl:-scale-x-100" />
                            </div>
                        </div>
                        
                        <div className="text-accent font-black text-lg tabular-nums z-10 w-24 text-left">
                            {myUserObj.xp.toLocaleString()} XP
                        </div>
                    </div>
                </div>
            )}
            
        </main>
    );
}
