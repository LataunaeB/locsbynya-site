import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        heroFade: {
          '0%': {
            opacity: '0',
            transform: 'translateY(12px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        bounceSlow: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 1s ease-out',
        'hero-fade': 'heroFade 0.7s ease-out forwards',
        'hero-fade-delay-1': 'heroFade 0.7s ease-out 0.1s forwards',
        'hero-fade-delay-2': 'heroFade 0.7s ease-out 0.15s forwards',
        'hero-fade-delay-3': 'heroFade 0.7s ease-out 0.25s forwards',
        'hero-fade-delay-4': 'heroFade 0.7s ease-out 0.35s forwards',
        'hero-fade-delay-5': 'heroFade 0.7s ease-out 0.4s forwards',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;







