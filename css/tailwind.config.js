module.exports = {
  darkMode: 'class',
  content: ['src/**/*.html','src/**/*.md'],
  safelist: [],
  theme: {
    extend: {
      colors: {
        change: 'transparent'
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      fontFamily: {
        'sans': ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        'inter': ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif']
      },
    },
  },
  variants: {
    extend: {
      translate: ['group-hover'],
    }
  },
  plugins: [],
}
