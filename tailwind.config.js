import defaultTheme from 'tailwindcss/defaultTheme';
import forms        from '@tailwindcss/forms';
import typography   from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50:  '#eef4ff',
          100: '#dbe4ff',
          200: '#b7c9ff',
          300: '#8aa8ff',
          400: '#6186ff',
          500: '#3d67ff',
          600: '#244ff5',
          700: '#153ed9',
          800: '#0d2eaa',
          900: '#092071',
        },
      },
    },
  },

  plugins: [
    forms,
    typography,
  ],
};
