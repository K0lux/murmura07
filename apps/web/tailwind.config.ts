export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0b6e4f',
        accent: '#c46a2a',
        'tension-low': '#2f7d32',
        'tension-medium': '#b58012',
        'tension-high': '#c46a2a',
        'tension-critical': '#ab3d33'
      }
    }
  },
  plugins: []
};
