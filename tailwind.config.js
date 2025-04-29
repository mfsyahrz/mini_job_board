/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0070f3',
        secondary: '#f5f7fa',
        background: '#f5f7fa',
        card: '#ffffff',
        text: {
          primary: '#333333',
          secondary: '#666666',
          muted: '#888888',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 