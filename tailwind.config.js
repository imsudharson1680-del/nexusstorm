/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#050A12',
          surface: '#0B1220',
          panel: '#101A2B',
          elevated: '#152238',
          border: '#1E3A5F',
          cyan: '#22D3EE',
          sky: '#38BDF8',
          blue: '#2563EB',
          safe: '#22C55E',
          warning: '#F59E0B',
          critical: '#EF4444',
          text: '#F8FAFC',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-sky': '0 0 20px -3px rgba(56, 189, 248, 0.45)',
        'glow-cyan': '0 0 20px -3px rgba(34, 211, 238, 0.45)',
        'glow-critical': '0 0 25px -2px rgba(239, 68, 68, 0.55)',
        'glow-warning': '0 0 20px -3px rgba(245, 158, 11, 0.45)',
        'glow-safe': '0 0 20px -3px rgba(34, 197, 94, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin 25s linear infinite reverse',
        'ripple': 'ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
