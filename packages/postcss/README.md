# 🎨 @autobg/postcss

[中文](./README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/@autobg/postcss.svg?style=flat)](https://www.npmjs.com/package/@autobg/postcss)
[![npm downloads](https://img.shields.io/npm/dm/@autobg/postcss.svg?style=flat)](https://www.npmjs.com/package/@autobg/postcss)

A [PostCSS](https://postcss.org/) plugin that provides [AtRules](https://postcss.org/api/#atrule) named `@autobg` and `@autobg-aspect`. With simple image path declarations, you can automatically set the background image and dimensions of elements.

## ✨ Key Features

- 🚀 Supports Vite and Webpack build tools
- 🔄 Recognizes image dimensions and applies them automatically
- 📍 Flexibly supports relative paths and path aliases
- 📐 Supports various flexible scaling modes
- 🎨 Provides two modes: `@autobg` and `@autobg-aspect`

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

> **Note**: The above Webpack configuration example uses craco, but it is also applicable to other Webpack configurations.

## 🎯 Usage Guide

### Basic Usage

```css
.foo {
  /* Basic usage - automatically sets background image and dimensions */
  @autobg url('./assets/foo.png');
}
```

### Proportional Scaling

#### Fixed Width or Height

```css
.foo {
  /* Fixed width, height calculated proportionally */
  @autobg url('./assets/foo.png') width(100px);
  @autobg url('./assets/foo.png') w(100px);

  /* Fixed height, width calculated proportionally */
  @autobg url('./assets/foo.png') height(100px);
  @autobg url('./assets/foo.png') h(100px);
}
```

#### Overall Scale Ratio

```css
.foo {
  /* Apply uniform scaling (number) */
  @autobg url('./assets/foo.png') scale(0.78);
  @autobg url('./assets/foo.png') s(0.78);

  /* Apply uniform scaling (percentage) */
  @autobg url('./assets/foo.png') scale(78%);
  @autobg url('./assets/foo.png') s(78%);
}
```

### Using aspect-ratio Property

Utilizing the modern CSS [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) property to maintain element aspect ratio, enabling more flexible layout control.

Especially suitable for responsive scaling scenarios, particularly effective when parent element dimensions change dynamically:

```css
/* Parent element height may change dynamically */
.parent {
  height: 200px;
}

.child {
  /* Child element will automatically maintain the original image aspect ratio and adapt to the parent element */
  @autobg-aspect url('./assets/foo.png') height();
}
```

When the parent element's height changes, the child element will automatically maintain the original image's aspect ratio, achieving proportional scaling.

#### Basic Usage

When width and height are not specified, only background and aspect ratio are generated:

```css
.foo {
  @autobg-aspect url('./assets/foo.png');
  /* Need to manually set width or height */
  width: 100%;
}
```

#### 📐 Specify Generated Width or Height

Automatically generate one dimension value (default 100%):

```css
.foo {
  /* Generate height, maintain original image aspect ratio */
  @autobg-aspect url('./assets/foo.png') height();
  @autobg-aspect url('./assets/foo.png') h();

  /* Generate width, maintain original image aspect ratio */
  @autobg-aspect url('./assets/foo.png') width();
  @autobg-aspect url('./assets/foo.png') w();
}
```

> 💡 **Note**: All method parameters must include parentheses, even if no specific value is passed. For example, you must use `height()` instead of `height`, which is a syntax requirement for PostCSS AtRule function calls.

#### Custom Ratios

Set width and height:

```css
.foo {
  /* Set height value, maintain original image aspect ratio */
  @autobg-aspect url('./assets/foo.png') height(78%);
  @autobg-aspect url('./assets/foo.png') h(78px);
  @autobg-aspect url('./assets/foo.png') h(78rem);

  /* Set width value, maintain original image aspect ratio */
  @autobg-aspect url('./assets/foo.png') width(78%);
  @autobg-aspect url('./assets/foo.png') w(78px);
  @autobg-aspect url('./assets/foo.png') w(78rem);
}
```

> 💡 **Tip**: In aspect mode, values are directly set to the width or height property without conversion.

### 📋 Scaling Options Overview

| Option                       | Syntax                                  | Description                                                                                             |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Width Scaling                | `@autobg url(...) width(value)`         | Fixed width, height automatically calculated proportionally (value represents pixels or specific units) |
| Height Scaling               | `@autobg url(...) height(value)`        | Fixed height, width automatically calculated proportionally (value represents pixels or specific units) |
| Overall Scaling              | `@autobg url(...) scale(value or %)`    | Uniformly scales both dimensions proportionally (number or percentage represents scaling ratio)         |
| Aspect Ratio Mode - Width    | `@autobg-aspect url(...) width()`       | Generates width and sets aspect-ratio, maintaining original image aspect ratio                          |
| Aspect Ratio Mode - Height   | `@autobg-aspect url(...) height()`      | Generates height and sets aspect-ratio, maintaining original image aspect ratio                         |
| Aspect Ratio Mode - Custom W | `@autobg-aspect url(...) width(value)`  | Sets width to specified value while maintaining original image aspect ratio                             |
| Aspect Ratio Mode - Custom H | `@autobg-aspect url(...) height(value)` | Sets height to specified value while maintaining original image aspect ratio                            |

## ⚠️ Notes

If you encounter `css(unknownAtRules)` warnings, please refer to the following solution:

- [Solving CSS unknownAtRules errors in Vue.js projects](https://stackoverflow.com/questions/71648391/duplicate-unknown-at-rule-apply-cssunknownatrules-errors-in-vue-js-project)

## 📝 Configuration Options

| Option     | Type                     | Default                                        | Description                                                                                                                         |
| ---------- | ------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| publicPath | `string`                 | `'public'`                                     | Static resource directory path, should be consistent with build tool configuration                                                  |
| alias      | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, should be consistent with build tool configuration<br>Pass an empty object `{}` if not using path aliases |

## 📄 License

MIT
