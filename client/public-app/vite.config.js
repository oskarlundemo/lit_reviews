import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/login': {
        target: 'http://localhost:5000',
      },
      '/create-user': {
        target: 'http://localhost:5000',
      },
      '/book-review': {
        target: 'http://localhost:5000',
      },
      '/latest': {
        target: 'http://localhost:5000',
      }
    },
  }
})
