import { nextui } from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: 'var(--lj-brand)',
        'brand-light': 'var(--lj-brand-light)',
        'brand-dark': 'var(--lj-brand-dark)',
        surface: 'var(--lj-surface)',
        'surface-2': 'var(--lj-surface-2)',
        ink: 'var(--lj-ink)',
        'ink-2': 'var(--lj-ink-2)',
        'ink-3': 'var(--lj-ink-3)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: '#6366f1',
              foreground: '#ffffff',
            },
            focus: '#6366f1',
          },
        },
        light: {
          colors: {
            primary: {
              DEFAULT: '#4f46e5',
              foreground: '#ffffff',
            },
            focus: '#4f46e5',
          },
        },
      },
    }),
  ],
}
