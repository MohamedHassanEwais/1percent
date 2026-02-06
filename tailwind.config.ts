import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                primary: {
                    DEFAULT: "#CCFF00",
                    foreground: "#000000",
                },
                secondary: {
                    DEFAULT: "#7C3AED",
                    foreground: "#FFFFFF",
                },
                surface: {
                    DEFAULT: "rgba(255, 255, 255, 0.05)",
                    hover: "rgba(255, 255, 255, 0.1)",
                },
                slate: {
                    400: "#94A3B8",
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                heading: ["var(--font-space-grotesk)"],
            },
            backgroundImage: {
                'galaxy-gradient': "radial-gradient(circle at center, #1a1a2e 0%, #000000 100%)",
            },
            boxShadow: {
                'neon-lime': "0 0 10px rgba(204, 255, 0, 0.5)",
                'neon-violet': "0 0 10px rgba(124, 58, 237, 0.5)",
            }
        },
    },
    plugins: [],
};
export default config;
