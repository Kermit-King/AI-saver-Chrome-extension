import { defineConfig } from 'vite'
import react from '@vitejs/react-swc'
import { crx } from '@crxjs/vite-plugin'
import manifest from '../manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
})