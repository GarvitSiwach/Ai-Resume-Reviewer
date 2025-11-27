/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0a0014",
                surface: "#1a0f2e",
                "surface-light": "#2d1b4e",
                primary: "#8b5cf6",
                "primary-light": "#a78bfa",
                "primary-dark": "#7c3aed",
                secondary: "#6366f1",
                accent: "#fbbf24",
                "accent-light": "#fcd34d",
                "accent-dark": "#f59e0b",
                text: "#f9fafb",
                "text-muted": "#cbd5e1",
                "text-dim": "#94a3b8",
                success: "#10b981",
                warning: "#f59e0b",
                danger: "#ef4444",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'shimmer': 'shimmer 3s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glowPulse: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(251, 191, 36, 0.2)',
                        borderColor: 'rgba(139, 92, 246, 0.6)'
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(139, 92, 246, 0.7), 0 0 60px rgba(251, 191, 36, 0.3)',
                        borderColor: 'rgba(139, 92, 246, 0.9)'
                    },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                }
            },
            boxShadow: {
                'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
                'glow-gold': '0 0 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.2)',
                'glow-strong': '0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(251, 191, 36, 0.3)',
            }
        },
    },
    plugins: [],
}
