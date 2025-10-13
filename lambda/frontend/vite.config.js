import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    outDir: '../src/frontend-dist',
    // Use relative asset paths so SPA works correctly regardless of base path
    assetsDir: 'assets',
    rollupOptions: {},
    // base: './' // optional
  }
});
