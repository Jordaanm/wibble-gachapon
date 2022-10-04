import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteWebfontDownload } from 'vite-plugin-webfont-dl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteWebfontDownload([
      'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',      
      'https://fonts.googleapis.com/css2?family=Heebo&display=swap'
    ])
  ],
  base: '/wibble-gachapon/'
})
