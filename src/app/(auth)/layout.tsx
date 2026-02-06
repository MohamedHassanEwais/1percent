import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80" />

            {/* Cyber Grid (Optional CSS enhancement) */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="relative z-10 w-full max-w-md p-6">
                {children}
            </div>
        </div>
    );
}
