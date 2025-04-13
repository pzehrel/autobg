# @autobg/babel.macro

[中文](./README.zh-CN.md)

A smart macro tool based on [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros), designed specifically for [styled-components](https://styled-components.com/).

Automatically get image dimensions and set corresponding CSS styles with simple local image paths.

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

```ts
// craco.config.ts
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
      // You can also use .babel-plugin-macrosrc.js
      ['babel-plugin-macros', {
        autobg: defineAutobgMacro({
          unit: 'px',
        }),
      }],
      ['babel-plugin-styled-components', { displayName: true }],
    ],
  },
} satisfies CracoConfig
```

> Note: The above Webpack configuration example uses craco, but it's also applicable to other Webpack configurations as long as the babel plugins are properly configured.

## 🎯 Usage Example

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  ${autobg('@/assets/foo.png')}

  /* Scale to specific width while preserving aspect ratio */
  ${autobg('@/assets/foo.png', 'w', 100)}
  ${autobg('@/assets/foo.png', 'width', 100)}

  /* Scale to specific height while preserving aspect ratio */
  ${autobg('@/assets/foo.png', 'h', 100)}
  ${autobg('@/assets/foo.png', 'height', 100)}

  /* Use numeric uniform scaling */
  ${autobg('@/assets/foo.png', 0.75)}
  ${autobg('@/assets/foo.png', 's', 0.75)}
  ${autobg('@/assets/foo.png', 'scale', 0.75)}

  /* Use percentage uniform scaling */
  ${autobg('@/assets/foo.png', '75%')}
  ${autobg('@/assets/foo.png', 's', '75%')}
  ${autobg('@/assets/foo.png', 'scale', '75%')}
`

export function Component() {
  return <Foo />
}
```

> Tip: When using path aliases or images from the `public` directory, make sure the `alias` and `publicPath` configurations match your Webpack configuration.

## 📝 Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| publicPath | `string` | `'public'` | Public directory path, should match build tool configuration |
| alias | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, should match build tool configuration. Pass an empty object `{}` if not using path aliases |
| unit | `'px'` \| `'rem'` \| `'vw'` | `'px'` | CSS unit type |
| rootValue | `number` | `100` | Root element font size (only effective when `unit` is `'rem'`) |
| designWidth | `number` | `750` | Design draft width (only effective when `unit` is `'vw'`) |
| unitPrecision | `number` | `5` | Precision (decimal places) when converting `px` to `rem` or `vw` |

## License

MIT
