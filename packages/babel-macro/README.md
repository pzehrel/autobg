# @autobg/babel.macro

[中文](./README.zh-CN.md)

A smart macro tool based on [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros), specifically designed for [styled-components](https://styled-components.com/).

Automatically set CSS styles based on image dimensions by simply providing a local image path.

## ✨ Features

- 🚀 Support for Vite and Webpack
- 🔄 Automatic image dimension handling

## 📦 Installation

```bash
pnpm add @autobg/babel-macro babel-plugin-macros styled-components
```

## ⚙️ Configuration

### Vite Configuration

```ts
// vite.config.ts
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
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
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

### Webpack Configuration

```js
// .babel-plugin-macrosrc.js
const { defineAutobgMacro } = require('@autobg/babel.macro')
module.exports = {
  autobg: defineAutobgMacro({ /** options */ }),
}
```

```ts
// craco.config.ts
import type { CracoConfig } from '@craco/types'
import { resolve } from 'node:path'

export default {
  webpack: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  babel: {
    plugins: [
      'babel-plugin-macros',
      ['babel-plugin-styled-components', { displayName: true }],
    ],
  },
} satisfies CracoConfig
```

> Note: The Webpack configuration example above uses craco, but it's also applicable to other Webpack configurations as long as the babel plugins are properly configured.

## 🎯 Usage Example

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  ${autobg('@/assets/foo.png')}
`

export function Component() {
  return <Foo />
}
```

> Tip: When using path aliases or images from the `public` directory, make sure the `alias` and `publicPath` configurations match your Webpack configuration.

## 📝 Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| publicPath | `string` | `'public'` | Public directory path, should match your build tool configuration |
| alias | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, should match your build tool configuration. Pass an empty object `{}` if not using path aliases |
| unit | `'px'` \| `'rem'` \| `'vw'` | `'px'` | CSS unit type |
| rootValue | `number` | `100` | Root element font size (only effective when `unit` is `'rem'`) |
| designWidth | `number` | `750` | Design draft width (only effective when `unit` is `'vw'`) |
| unitPrecision | `number` | `5` | Precision (decimal places) when converting `px` to `rem` or `vw` |

## License

MIT
