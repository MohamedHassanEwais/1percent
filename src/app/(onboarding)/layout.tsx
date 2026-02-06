import React from "react";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            {/* Background Graphic */}
            <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute top-[40%] -right-[10%] h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[100px]" />

            <div className="relative z-10 flex h-full flex-col">
                {children}
            </div>
        </div>
    );
}
