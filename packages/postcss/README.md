# @autobg/postcss

[中文](./README.zh-CN.md)

A [PostCSS](https://postcss.org/) plugin that provides an [AtRule](https://postcss.org/api/#atrule) named `@autobg`. With a simple image path declaration, it automatically sets the element's width and height to match the actual image dimensions.

## ✨ Features

- 🚀 Support for Vite and Webpack build tools
- 🔄 Automatic image dimension detection and application
- 🔍 Path alias support

## 📦 Installation

```bash
pnpm add @autobg/postcss
```

## ⚙️ Configuration

### Vite Configuration

```ts
// vite.config.ts
import { resolve } from 'node:path'
import { postcssAutobg } from '@autobg/postcss'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssAutobg(),
      ],
    },
  },
})
```

### Webpack Configuration

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
  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: {
        postcssOptions: {
          plugins: [postcssAutobg()],
        }
      }
    }
  },
} satisfies CracoConfig
```

> Note: The Webpack configuration example above uses craco, but it's also applicable to other Webpack configurations.

## 🎯 Usage Examples

```css
.foo {
  @autobg: url('./assets/foo.png'); /* Recommended */
  @autobg url('./assets/foo.png');  /* Recommended */
  @autobg(./assets/foo.png);
  @autobg ./assets/foo.png;
}
```

## ⚠️ Notes

If you encounter `css(unknownAtRules)` warnings, please refer to the following solution:

- [Resolving CSS unknownAtRules errors in Vue.js projects](https://stackoverflow.com/questions/71648391/duplicate-unknown-at-rule-apply-cssunknownatrules-errors-in-vue-js-project)

## 📝 Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| publicPath | `string` | `'public'` | Static resource directory path, should match your build tool configuration |
| alias | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, should match your build tool configuration. Pass an empty object `{}` if not using path aliases |
| unit | `'px'` \| `'rem'` \| `'vw'` | `'px'` | CSS unit type |
| rootValue | `number` | `100` | Root element font size (only effective when `unit` is `'rem'`) |
| designWidth | `number` | `750` | Design draft width (only effective when `unit` is `'vw'`) |
| unitPrecision | `number` | `5` | Precision (decimal places) when converting `px` to `rem` or `vw` |

## 📄 License

MIT
