/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#202126',
        surface: {
          DEFAULT: '#282a34',
          muted: '#202126',
          subtle: '#2f3240',
          card: '#292b36',
        },
        border: {
          DEFAULT: '#383b4a',
          subtle: '#434759',
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
        'safe-left': 'env(safe-area-inset-left, 0px)',
        'safe-right': 'env(safe-area-inset-right, 0px)',
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom, 0px)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
          'sans-serif'
        ],
        mono: [
          'SF Mono',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ],
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.pt-safe': {
          paddingTop: 'env(safe-area-inset-top, 0px)',
        },
        '.pb-safe': {
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        },
        '.pl-safe': {
          paddingLeft: 'env(safe-area-inset-left, 0px)',
        },
        '.pr-safe': {
          paddingRight: 'env(safe-area-inset-right, 0px)',
        },
        '.mt-safe': {
          marginTop: 'env(safe-area-inset-top, 0px)',
        },
        '.mb-safe': {
          marginBottom: 'env(safe-area-inset-bottom, 0px)',
        },
        '.bottom-safe': {
          bottom: 'env(safe-area-inset-bottom, 0px)',
        },
      })
    }
  ],
}
