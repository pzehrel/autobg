# 🎨 @autobg/babel.macro

[中文](./README.zh-CN.md)

A [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) based tool designed specifically for [styled-components](https://styled-components.com/). By simply declaring a local image path, it automatically gets image dimensions and sets corresponding CSS styles.

## ✨ Key Features

- 🚀 Support for Vite and Webpack build tools
- 🔄 Recognition of image dimensions and automatic application
- 📍 Flexible support for relative paths and path aliases
- 📐 Support for multiple flexible scaling modes
- 🎨 Provides both regular and aspect-ratio modes
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

> **Note**: The above Webpack configuration example uses craco, but it applies to other Webpack configurations as long as the babel plugins are properly configured.

## 🎯 Usage Guide

### Basic Usage

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  /* Basic usage - automatically set background image and dimensions */
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
  /* Decimal form (0.75x scaling) */
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

Utilize the modern CSS [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) property to maintain element aspect ratio, enabling more flexible layout control.

Especially suitable for responsive scaling scenarios, particularly effective when parent element dimensions change dynamically:

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

// Parent element height may change dynamically
const Parent = styled.div`
  height: 200px;
`

// Child element will automatically maintain the original image aspect ratio and adapt to the parent element
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

When width and height are not specified, only the background and aspect ratio are generated, requiring manual addition of width or height:

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  /* Need to manually set width or height */
  ${autobg.aspect('@/assets/foo.png')}
  width: 100%;
`
```

#### Specify Generated Width or Height

Automatically generate one dimension's value (default 100%), and maintain the original image's aspect ratio:

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

// Generate height, maintain original image aspect ratio
const HeightAuto = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'height')}
  ${autobg.aspect('@/assets/foo.png', 'h')}
`

// Generate width, maintain original image aspect ratio
const WidthAuto = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'width')}
  ${autobg.aspect('@/assets/foo.png', 'w')}
`
```

#### Custom Ratio

Provide percentage or decimal values to precisely set the corresponding dimension:

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

// Set height to 78%, width calculated proportionally
const HeightCustom = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'height', '78%')}
  ${autobg.aspect('@/assets/foo.png', 'h', 0.78)}
`

// Set width to 78%, height calculated proportionally
const WidthCustom = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'width', '78%')}
  ${autobg.aspect('@/assets/foo.png', 'w', 0.78)}
`
```

> 💡 **Tip**: In aspect mode, both numeric values and percentages are converted to percentage values. This differs from normal mode scaling behavior, where numeric values represent specific pixel values.

### 📋 Scaling Options Overview

| Option                     | Syntax                                 | Description                                                                                                                                   |
| -------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Width scaling              | `autobg(path, 'width', value)`         | Fixed width, height automatically calculated proportionally (value represents pixels or other specific units)                                 |
| Height scaling             | `autobg(path, 'height', value)`        | Fixed height, width automatically calculated proportionally (value represents pixels or other specific units)                                 |
| Overall scaling            | `autobg(path, value or percentage)`    | Scale both dimensions proportionally (numeric value represents scale ratio, percentage represents scale ratio)                                |
| Aspect ratio mode - width  | `autobg.aspect(path, 'width')`         | Generate width and set aspect-ratio, maintaining original image aspect ratio                                                                  |
| Aspect ratio mode - height | `autobg.aspect(path, 'height')`        | Generate height and set aspect-ratio, maintaining original image aspect ratio                                                                 |
| Aspect ratio mode - custom | `autobg.aspect(path, 'width', value)`  | Set width to specified ratio and maintain original image aspect ratio (both numeric values and percentages are treated as percentage values)  |
| Aspect ratio mode - custom | `autobg.aspect(path, 'height', value)` | Set height to specified ratio and maintain original image aspect ratio (both numeric values and percentages are treated as percentage values) |

> 💡 **Tip**: When using path aliases or images from the `public` directory, make sure the `alias` and `publicPath` configurations match your build tool configuration.

## 📝 Configuration Options

| Option        | Type                        | Default Value                                  | Description                                                                                                               |
| ------------- | --------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| publicPath    | `string`                    | `'public'`                                     | Public directory path, must match the build tool configuration                                                            |
| alias         | `Record<string, string>`    | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, must match the build tool configuration<br>If not using path aliases, pass an empty object `{}` |
| unit          | `'px'` \| `'rem'` \| `'vw'` | `'px'`                                         | CSS unit type                                                                                                             |
| rootValue     | `number`                    | `100`                                          | Root element font size (only effective when `unit` is `'rem'`)                                                            |
| designWidth   | `number`                    | `750`                                          | Design draft width (only effective when `unit` is `'vw'`)                                                                 |
| unitPrecision | `number`                    | `5`                                            | Precision (decimal places) when converting `px` to `rem` or `vw`                                                          |

## 📄 License

MIT
