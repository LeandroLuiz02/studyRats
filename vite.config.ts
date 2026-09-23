import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // Caminho relativo: funciona tanto em '<usuario>.github.io' quanto em
  // 'github.io/<nome-do-repositorio>', sem precisar saber o nome do repo.
  base: './',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    css: true,
    exclude: ['node_modules', 'dist', 'tests/e2e/**'],
  },
})
