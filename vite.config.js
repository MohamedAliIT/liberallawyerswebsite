// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

const emptyMod = path.resolve(__dirname, 'resources/js/empty-module.js');

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.jsx'], // عدّل المسار لو مختلف عندك
      refresh: true,
    }),
    react(),
  ],

  resolve: {
    alias: {
      // أي استيراد لهذه الحزم في واجهة المتصفح يتحول لوحدة فارغة
      'puppeteer': emptyMod,
      'puppeteer-core': emptyMod,
      'puppeteer-extra': emptyMod,
      'puppeteer-extra-plugin-stealth': emptyMod,
      'merge-deep': emptyMod,
      'clone-deep': emptyMod,
      'debug': emptyMod,
      'ms': emptyMod,

      // لو حصل استيراد لملف السكربت بطريق الخطأ
      'scripts/uae_legis_scrape.js': emptyMod,
      '/scripts/uae_legis_scrape.js': emptyMod,


    },
  },

  optimizeDeps: {
    // لا تقم بعمل pre-bundle لهذه الحزم
    exclude: [
      'puppeteer', 'puppeteer-core',
      'puppeteer-extra', 'puppeteer-extra-plugin-stealth',
      'merge-deep', 'clone-deep', 'debug', 'ms',
    ],
  },
});
