import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Exposes to 0.0.0.0 for external/tunnel access
    allowedHosts: true, // Allows all incoming ngrok tunnel hostnames
    cors: true
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true,
    cors: true
  }
})
