/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950
        card: '#0f172a', // slate-900
        border: '#1e293b', // slate-800
        primary: {
          DEFAULT: '#10b981', // emerald-500
          hover: '#059669', // emerald-600
        },
        warning: {
          DEFAULT: '#f59e0b', // amber-500
          hover: '#d97706', // amber-600
        },
        danger: {
          DEFAULT: '#f43f5e', // rose-500
          hover: '#e11d48', // rose-600
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
