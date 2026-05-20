/* tokens/tokens.ts */

export const tokens = {
  colors: {
    frankYellow: 'var(--brand-primary)',
    hotPink: 'var(--brand-hot-pink)',
    electricBlue: 'var(--brand-electric-blue)',
    inkBlack: 'var(--brand-ink-black)',
    cream: 'var(--brand-cream)',
    holoViolet: 'var(--brand-holo-violet)',
  },
  fonts: {
    display: 'var(--font-family-display)',
    sans: 'var(--font-family-sans)',
  },
  weights: {
    black: 'var(--font-weight-black)',
    bold: 'var(--font-weight-bold)',
    medium: 'var(--font-weight-medium)',
    regular: 'var(--font-weight-regular)',
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    full: 'var(--radius-full)',
  },
  spacing: {
    1: 'var(--space-1)',
    2: 'var(--space-2)',
    3: 'var(--space-3)',
    4: 'var(--space-4)',
    6: 'var(--space-6)',
    8: 'var(--space-8)',
    12: 'var(--space-12)',
  }
} as const;

export type DesignTokens = typeof tokens;
