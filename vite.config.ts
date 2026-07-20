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
        // الحل النهائي: تجاهل حزم الباك إند والتحليل المسبق بالكامل لمنع كسر البناء للهاتف
        external: (id) => {
          return (
            id.includes('fsevents') || 
            id.includes('fdir') || 
            id.includes('tinyglobby') || 
            id.includes('picomatch') || 
            id.startsWith('node:') || 
            ['path', 'fs', 'express', 'module', 'url'].includes(id)
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
