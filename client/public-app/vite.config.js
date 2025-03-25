// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://let-reviews-back-end.onrender.com', // Backend deployed URL
        changeOrigin: true,
        secure: false, // If your backend uses HTTPS but with a self-signed certificate
        rewrite: (path) => path.replace(/^\/api/, ''), // Ensure /api is removed
      },
    },
  },
});
