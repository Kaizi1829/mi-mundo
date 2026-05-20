import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef2f6',
          100: '#d4dde8',
          200: '#a8c0d6',
          300: '#7aa2c0',
          400: '#4a83a8',
          500: '#2c6e8a',
          600: '#1a4f66',
          700: '#1a3a5c',
          800: '#132d4a',
          900: '#0d2137',
          950: '#081524',
        },
        ocean: {
          50:  '#f0f8fb',
          100: '#d6edf5',
          200: '#a8d5e2',
          300: '#6dbdd4',
          400: '#4a9bb5',
          500: '#2c6e8a',
          600: '#1a4f66',
        },
        sand: {
          50:  '#fdfaf5',
          100: '#f4efe6',
          200: '#e8dcc8',
          300: '#d9c18a',
          400: '#c4a661',
          500: '#b08d3f',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        card:       '0 1px 4px rgba(13,33,55,0.07), 0 1px 2px rgba(13,33,55,0.04)',
        'card-md':  '0 4px 12px rgba(13,33,55,0.10), 0 2px 4px rgba(13,33,55,0.06)',
        'card-lg':  '0 8px 24px rgba(13,33,55,0.14)',
        'inner-ocean': 'inset 0 1px 2px rgba(44,110,138,0.12)',
      },
    },
  },
  plugins: [],
}
export default config
