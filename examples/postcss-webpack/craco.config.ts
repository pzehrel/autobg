import type { CracoConfig } from '@craco/types'
import { resolve } from 'node:path'
import postcssAutobg from '@autobg/postcss'

export default {
  webpack: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  style: {
    postcss: {
      mode: 'extends',
      // plugins: [postcssAutobg()], // this will not work. what the fxxx?
      loaderOptions: {
        postcssOptions: {
          plugins: [postcssAutobg()],
        },
      },
    },
  },

  eslint: {
    enable: false,
  },
} satisfies CracoConfig
