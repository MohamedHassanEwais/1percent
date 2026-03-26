"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { Bell, CreditCard, LogOut, Moon, Volume2 } from "lucide-react";

export default function SettingsPage() {
    const settings = [
        { icon: Bell, label: "Notifications", value: "On" },
        { icon: Volume2, label: "Sound Effects", value: "80%" },
        { icon: Moon, label: "Theme", value: "Cyber Dark" },
        { icon: CreditCard, label: "Subscription", value: "Free Plan" },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <h1 className="text-2xl font-heading font-bold uppercase mb-8">System Config</h1>

            <div className="space-y-4">
                {settings.map((item) => {
                    const Icon = item.icon;
                    return (
                        <GlassCard key={item.label} className="flex justify-between items-center p-4" intensity="low">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded bg-white/5 flex items-center justify-center">
                                    <Icon className="h-5 w-5 text-slate-300" />
                                </div>
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <span className="text-slate-500 text-sm">{item.value}</span>
                        </GlassCard>
                    )
                })}
            </div>

            <div className="mt-8">
                <NeonButton variant="danger" className="w-full gap-2">
                    <LogOut className="h-4 w-4" /> Disconnect
                </NeonButton>
            </div>

            <p className="text-center text-xs text-slate-600 mt-8 font-mono">
                v0.1.0-alpha // BUILD_20240205
            </p>
        </div>
    );
}
