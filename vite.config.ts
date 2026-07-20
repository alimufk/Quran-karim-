import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        // الحل القاطع: تخطي حزم النود وحزم التحليل المسبق مثل fdir و fsevents بالكامل لمنع كسر البناء
        external: (id) => {
          return (
            id.includes('fsevents') || 
            id.includes('fdir') || 
            id.startsWith('node:') || 
            ['path', 'fs', 'express', 'module'].includes(id)
          );
        }
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
