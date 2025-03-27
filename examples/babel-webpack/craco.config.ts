import { CracoConfig } from '@craco/types'
import { resolve } from 'path';


export default {
  webpack: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  babel: {
    plugins: [

      // https://styled-components.com/docs/tooling#better-debugging
      [ 'babel-plugin-styled-components', { displayName: true } ]
    ]
  },
  eslint: {
    enable: false,
  }

} satisfies CracoConfig
