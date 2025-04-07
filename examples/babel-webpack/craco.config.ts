import type { CracoConfig } from '@craco/types'
import { resolve } from 'node:path'
import { defineAutobgMacro } from '@autobg/babel.macro'

export default {
  webpack: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  babel: {
    plugins: [
      ['babel-plugin-macros', {
        autobg: defineAutobgMacro({
          unit: 'vw',
        }),
      }],
      // https://styled-components.com/docs/tooling#better-debugging
      ['babel-plugin-styled-components', { displayName: true }],
    ],
  },
  eslint: {
    enable: false,
  },

} satisfies CracoConfig
