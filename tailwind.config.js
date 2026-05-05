/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'slate-deep': '#060a14',
        'navy-glass': '#0e1626',
        'cyan-glow': '#22d3ee',
        'blue-glow': '#60a5fa',
      },
      fontFamily: {
        sans: ['"Manrope"', 'sans-serif'],
        display: ['"Sora"', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 16px 50px rgba(2, 8, 23, 0.45)',
        glow: '0 0 0 1px rgba(96, 165, 250, 0.3), 0 14px 35px rgba(34, 211, 238, 0.16)',
      },
      backgroundImage: {
        'grid-pattern':
          'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.2) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}
