// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://let-reviews-back-end.onrender.com', // Backend deployed URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Remove /api from the URL before sending
      },
    },
  },
});
