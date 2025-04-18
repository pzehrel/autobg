# 🎨 @autobg/babel.macro

[中文](./README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/@autobg/babel.macro.svg?style=flat)](https://www.npmjs.com/package/@autobg/babel.macro)
[![npm downloads](https://img.shields.io/npm/dm/@autobg/babel.macro.svg?style=flat)](https://www.npmjs.com/package/@autobg/babel.macro)

A macro tool based on [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros), specifically designed for [styled-components](https://styled-components.com/). It automatically obtains image dimensions and sets corresponding CSS styles through simple local image paths.

## ✨ Core Features

- 🚀 Support for Vite and Webpack build tools
- 🔄 Automatically detect image dimensions and apply them
- 📍 Flexible support for relative paths and path aliases
- 📐 Support for various flexible scaling modes
- 🎨 Provides both standard and aspect-ratio modes
- 📏 Support for unit conversion (px, rem, vw)

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

> **Note**: The Webpack configuration example above uses craco, but it's also applicable to other Webpack configurations, as long as the babel plugins are correctly configured.

## 🎯 Usage Guide

### Basic Usage

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  /* Basic usage - automatically sets background image and dimensions */
  ${autobg('@/assets/foo.png')}
`
```

### Proportional Scaling

#### Fixed Width or Height

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  /* Fixed width, height calculated proportionally */
  ${autobg('@/assets/foo.png', 'w', 100)}
  ${autobg('@/assets/foo.png', 'width', 100)}

  /* Fixed height, width calculated proportionally */
  ${autobg('@/assets/foo.png', 'h', 100)}
  ${autobg('@/assets/foo.png', 'height', 100)}
`
```

#### Overall Scale Ratio

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  /* Numeric form (0.75x scaling) */
  ${autobg('@/assets/foo.png', 0.75)}
  ${autobg('@/assets/foo.png', 's', 0.75)}
  ${autobg('@/assets/foo.png', 'scale', 0.75)}

  /* Percentage form (scale to 75%) */
  ${autobg('@/assets/foo.png', '75%')}
  ${autobg('@/assets/foo.png', 's', '75%')}
  ${autobg('@/assets/foo.png', 'scale', '75%')}
`
```

### Using the aspect-ratio Property

Leveraging the modern CSS [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) property to maintain element proportions, enabling more flexible layout control.

Particularly suitable for responsive scaling scenarios, especially effective when parent element dimensions change dynamically:

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

// Parent element height may change dynamically
const Parent = styled.div`
  height: 200px;
`

// Child element will automatically maintain the original image aspect ratio and adapt to the parent
const Child = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'height')}
`

export function Component() {
  return (
    <Parent>
      <Child />
    </Parent>
  )
}
```

When the parent element's height changes, the child element will automatically maintain the original image's aspect ratio, achieving proportional scaling.

#### Basic Usage

When width and height are not specified, only generates background and aspect ratio:

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  ${autobg.aspect('@/assets/foo.png')}
  /* Need to manually set width or height */
  width: 100%;
`
```

#### 📐 Specify Generated Width or Height

Automatically generates one dimension value (default 100%):

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

// Generates height, maintains original image aspect ratio
const HeightAuto = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'height')}
  ${autobg.aspect('@/assets/foo.png', 'h')}
`

// Generates width, maintains original image aspect ratio
const WidthAuto = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'width')}
  ${autobg.aspect('@/assets/foo.png', 'w')}
`
```

#### Custom Ratio

Set width and height:

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

// Set height value, maintain original image aspect ratio
const HeightCustom = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'height', '78%')}
  ${autobg.aspect('@/assets/foo.png', 'h', '78px')}
  ${autobg.aspect('@/assets/foo.png', 'h', '78rem')}
`

// Set width value, maintain original image aspect ratio
const WidthCustom = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'width', '78%')}
  ${autobg.aspect('@/assets/foo.png', 'w', '78px')}
  ${autobg.aspect('@/assets/foo.png', 'w', '78rem')}
`
```

> 💡 **Tip**: In aspect mode, values are directly set to width or height properties without conversion.

### 📋 Scaling Options Overview

| Option                       | Syntax                                 | Description                                                                                |
| ---------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------ |
| Width Scaling                | `autobg(path, 'width', value)`         | Fixed width, height calculated proportionally (value represents pixels or specific units)  |
| Height Scaling               | `autobg(path, 'height', value)`        | Fixed height, width calculated proportionally (value represents pixels or specific units)  |
| Overall Scaling              | `autobg(path, value or percentage)`    | Proportionally scales both dimensions (numeric value or percentage represents scale ratio) |
| Aspect Ratio - Width         | `autobg.aspect(path, 'width')`         | Generates width and sets aspect-ratio, maintaining original image proportions              |
| Aspect Ratio - Height        | `autobg.aspect(path, 'height')`        | Generates height and sets aspect-ratio, maintaining original image proportions             |
| Aspect Ratio - Custom Width  | `autobg.aspect(path, 'width', value)`  | Sets width to specified value while maintaining original image proportions                 |
| Aspect Ratio - Custom Height | `autobg.aspect(path, 'height', value)` | Sets height to specified value while maintaining original image proportions                |

> 💡 **Tip**: When using path aliases or images in the `public` directory, ensure that `alias` and `publicPath` configurations match your build tool configuration.

## 📝 Configuration Options

| Option        | Type                        | Default                                        | Description                                                                                                      |
| ------------- | --------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| publicPath    | `string`                    | `'public'`                                     | Static resource directory path, must match build tool configuration                                              |
| alias         | `Record<string, string>`    | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, must match build tool configuration<br>Use empty object `{}` if not using path aliases |
| unit          | `'px'` \| `'rem'` \| `'vw'` | `'px'`                                         | CSS unit type                                                                                                    |
| rootValue     | `number`                    | `100`                                          | Root element font size (only effective when `unit` is `'rem'`)                                                   |
| designWidth   | `number`                    | `750`                                          | Design draft width (only effective when `unit` is `'vw'`)                                                        |
| unitPrecision | `number`                    | `5`                                            | Precision (decimal places) when converting `px` to `rem` or `vw`                                                 |

## 📄 License

MIT
