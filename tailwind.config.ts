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
        cream: {
          50: '#fdfbf7',
          100: '#f9f4ec',
          200: '#f2e8d8',
          300: '#e8d9c0',
          400: '#d9c4a0',
          500: '#c9a96e',
          600: '#b8924a',
          700: '#9a7a3d',
          800: '#7a6030',
          900: '#5c4822',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e8f0e8',
          200: '#cde0cd',
          300: '#a8c8a8',
          400: '#7fad7f',
          500: '#5a8f5a',
          600: '#477247',
        },
        warm: {
          bg: '#f7f2ec',
          card: '#ffffff',
          sidebar: '#fdfaf6',
          border: '#ede5d8',
          text: '#2d2520',
          muted: '#8c7b6b',
          accent: '#c9a96e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
export default config
