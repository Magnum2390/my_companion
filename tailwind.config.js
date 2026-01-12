/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0f172a", // Slate 900
                    dark: "#020617",    // Slate 950 (Midnight)
                    light: "#1e293b",   // Slate 800
                },
                accent: {
                    DEFAULT: "#d4af37", // Metallic Gold
                    light: "#fbbf24",   // Amber 400
                    dark: "#b45309",    // Amber 700
                    glow: "#f59e0b",    // Amber 500
                },
                bg: {
                    body: "#fcf9f6",    // Warm Paper / Off-white (Light Mode base)
                    glass: "rgba(255, 255, 255, 0.7)",
                    dark: "#0f172a",    // Deep Blue Background
                },
                text: {
                    main: "#1e293b",    // Slate 800
                    muted: "#64748b",   // Slate 500
                    light: "#f8fafc",   // Slate 50
                }
            },
            fontFamily: {
                serif: ['Cinzel', 'serif'],           // Titles
                sans: ['Inter', 'sans-serif'],        // Body
                display: ['Playfair Display', 'serif'], // Elegant Quotes
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #d4af3720 0deg, #0f172a00 360deg)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'glow': '0 0 20px rgba(212, 175, 55, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
