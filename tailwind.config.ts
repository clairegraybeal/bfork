import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Letterboxd-inspired dark palette
        'bf-bg': '#14181c',
        'bf-card': '#1c2228',
        'bf-card-hover': '#242c34',
        'bf-border': '#2c3440',
        'bf-text': '#9ab',
        'bf-text-light': '#def',
        'bf-accent': '#ff8000', // Orange accent like Letterboxd green but warmer
        'bf-accent-hover': '#ff9933',
        'bf-star': '#ff8000',
      },
      fontFamily: {
        sans: ['var(--font-graphik)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

