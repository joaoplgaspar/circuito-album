import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    // Orçamento do case: JS inicial < 180KB gzip. three/R3F e GSAP/Lenis só
    // entram por dynamic import (P2/P3) e caem em chunks próprios, fora do
    // bundle inicial. (No build SSR do prerender, chunking não se aplica.)
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks: (id: string) => {
              if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three'
              if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion'
            },
          },
        },
  },
}))
