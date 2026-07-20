import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // نربط مسار node:path بمسار وهمي متوافق مع المتصفح لمنع الخطأ نهائياً
        'node:path': 'path-browserify',
        'path': 'path-browserify',
      },
    },
    build: {
      rollupOptions: {
        // نترك الإضافات الخارجية للسيرفر والملفات التي لا يحتاجها الهاتف
        external: [
          'fsevents',
          'fs',
          'fs/promises',
          'express'
        ]
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
