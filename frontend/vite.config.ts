import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'swiper',
      'swiper/react',
      'swiper/css',
      'swiper/css/navigation',
      'swiper/css/pagination',
      '@popperjs/core',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      '@mui/x-date-pickers',
      '@mui/x-date-pickers/AdapterDateFns',
      'date-fns'
    ],
    force: true
  },
  server: {
    port: 5174,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5174
    },
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@popperjs/core': '@popperjs/core/dist/umd/popper.js'
    }
  }
}) 
