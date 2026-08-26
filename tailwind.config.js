/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
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
  plugins: [],
}
