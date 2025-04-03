import { resolve } from 'node:path'
import { postcssAutobg } from '@autobg/postcss'
// import { viteAutobg } from '@autobg/postcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // viteAutobg(),
    react({
      include: /\.(jsx|tsx)$/,
      babel: {
        plugins: [
          'babel-plugin-macros',
          'styled-components',
        ],
        babelrc: false,
        configFile: false,
      },
    })
  ],

  css: {
    postcss: {
      plugins: [
        postcssAutobg(),
      ],
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
