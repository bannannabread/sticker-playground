// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--brand-primary)',
        'frank-yellow': 'var(--brand-primary)',
        'hot-pink': 'var(--brand-hot-pink)',
        'electric-blue': 'var(--brand-electric-blue)',
        'ink-black': 'var(--brand-ink-black)',
        'cream': 'var(--brand-cream)',
        'holo-violet': 'var(--brand-holo-violet)',
      },
      fontFamily: {
        display: 'var(--font-family-display)',
        sans: 'var(--font-family-sans)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
} satisfies Config;
