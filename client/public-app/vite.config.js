import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api/login': {
        target: 'http://localhost:5000',
      },
      '/api/create-user': {
        target: 'http://localhost:5000',
      },
      '/api/book-review': {
        target: 'http://localhost:5000',
      },
      '/api/latest': {
        target: 'http://localhost:5000',
      },
      '/api/comments': {
        target: 'http://localhost:5000',
      },
      '/api/posts': {
        target: 'http://localhost:5000',
      },
      '/api/activity': {
        target: 'http://localhost:5000',
      }
    },
  }
})
