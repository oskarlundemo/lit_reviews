// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://litreviews.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\//, '/'),
      },
    },
  },
});