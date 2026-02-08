/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'blush-100': '#FFF5F7',
        'blush-200': '#FFE5E5',
        'blush-300': '#FFB3C1',
        'blush-400': '#FF8FA3',
        'coral': '#FF6B6B',
        'coral-dark': '#FF4757',
        'lavender': '#D4A5A5',
        'cream': '#FFF9F0',
        'charcoal': '#4A4A4A',
        'charcoal-light': '#6B6B6B',
        'rose-gold': '#B76E79',
        'soft-white': '#FFFAFA',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['DM Sans', 'sans-serif'],
        'handwritten': ['Caveat', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(255, 107, 107, 0.1)',
        'medium': '0 8px 30px rgba(255, 107, 107, 0.15)',
        'glow': '0 0 30px rgba(255, 179, 193, 0.4)',
      },
    },
  },
  plugins: [],
}
