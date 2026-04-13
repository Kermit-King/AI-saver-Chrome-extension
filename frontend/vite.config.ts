import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx } from '@crxjs/vite-plugin'
import manifest from '../manifest.json'

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
    cors: {
      origin: '*', // Allows the extension to access Vite
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // Added 'Accept' based on your error
    },
  },
})