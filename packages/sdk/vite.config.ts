import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DeonPayElements',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.mjs'
        if (format === 'umd') return 'deonpay-elements.js'
        return 'index.js'
      },
    },
    rollupOptions: {
      external: (id) => {
        // For UMD build, we need to bundle React, but for es/cjs we want it external
        const isReactDep = ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'].includes(id)
        return isReactDep // Will be external for all formats, UMD will use globals
      },
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
})
