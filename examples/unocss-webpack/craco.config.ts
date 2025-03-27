import type { CracoConfig } from '@craco/types'
import { resolve } from 'node:path'
import unocss from '@unocss/webpack'

export default {
  webpack: {
    configure: (config) => {
      config.plugins?.push(unocss())

      const entry = (config.entry || 'src/index.ts') as string
      const entryArray = Array.isArray(entry) ? entry : [entry]
      config.entry = [
        'uno.css', // src/index.ts is not allowed to import content outside of the src directory.
        ...entryArray,
      ]

      return config
    },
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  eslint: {
    enable: false,
  },
} satisfies CracoConfig
