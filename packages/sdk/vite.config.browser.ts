import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Browser-only build configuration for CDN distribution
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DeonPay',
      formats: ['iife'],
      fileName: () => 'deonpay-elements-v1.js',
    },
    rollupOptions: {
      // Bundle React with the library for browser use
      external: [],
      output: {
        // Make React available globally if needed
        globals: {},
        // Ensure clean IIFE format
        format: 'iife',
        // Export DeonPay as global variable
        extend: true,
      },
    },
    outDir: '../../apps/elements/public/sdk',
    emptyOutDir: false, // Don't clear the directory
    sourcemap: true,
    minify: 'esbuild',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
