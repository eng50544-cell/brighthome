import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0F0F1A',
        'primary-silver': '#C0C0C0',
        'dark-silver': '#708090',
        'accent-silver': '#E8E8E8',
        'deep-contrast': '#1C1C1C',
        'gold-cta': '#D4AF37',
        'lamp-glow': '#06B6D4',
        'card-bg': '#151525',
        'border-silver': 'rgba(192,192,192,0.15)',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
        'silver-gradient': 'linear-gradient(135deg, #708090 0%, #C0C0C0 50%, #708090 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0F0F1A 0%, #1C1C2E 100%)',
        'glow-gradient': 'radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212,175,55,0.3)',
        'glow': '0 0 30px rgba(6,182,212,0.2)',
        'silver': '0 4px 20px rgba(192,192,192,0.1)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212,175,55,0.6)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
