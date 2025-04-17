# 🎨 @autobg/postcss

[中文](./README.zh-CN.md)

A [PostCSS](https://postcss.org/) plugin that provides `@autobg` and `@autobg-aspect` [AtRules](https://postcss.org/api/#atrule). By simply declaring an image path, it automatically sets the element's background image and dimensions.

## ✨ Key Features

- 🚀 Support for Vite and Webpack build tools
- 🔄 Recognition of image dimensions and automatic application
- 📍 Flexible support for relative paths and path aliases
- 📐 Support for multiple flexible scaling modes
- 🎨 Provides both `@autobg` and `@autobg-aspect` modes

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

> **Note**: The above Webpack configuration example uses craco, but it applies to other Webpack configurations as well.

## 🎯 Usage Guide

### Basic Usage

```css
.foo {
  /* Basic usage - automatically set background image and dimensions */
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
  /* Apply uniform scaling (numeric) */
  @autobg url('./assets/foo.png') scale(0.78);
  @autobg url('./assets/foo.png') s(0.78);

  /* Apply uniform scaling (percentage) */
  @autobg url('./assets/foo.png') scale(78%);
  @autobg url('./assets/foo.png') s(78%);
}
```

### Using the aspect-ratio Property

Utilize the modern CSS [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) property to maintain element aspect ratio, enabling more flexible layout control.

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

When width and height are not specified, only the background and aspect ratio are generated, requiring manual addition of width or height:

```css
.foo {
  @autobg-aspect url('./assets/foo.png');
  /* Need to manually set width or height */
  width: 100%;
}
```

#### Specify Generated Width or Height

Automatically generate one dimension's value (default 100%), and maintain the original image's aspect ratio:

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

> 💡 **Note**: All method parameters must include parentheses, even when no specific value is passed. For example, you must use `height()` instead of `height` - this is a syntax requirement for PostCSS AtRule function calls.

#### Custom Ratio

Provide percentage or decimal values to precisely set the corresponding dimension:

```css
.foo {
  /* Set height to 78%, width calculated proportionally */
  @autobg-aspect url('./assets/foo.png') height(78%);
  @autobg-aspect url('./assets/foo.png') h(0.78);

  /* Set width to 78%, height calculated proportionally */
  @autobg-aspect url('./assets/foo.png') width(78%);
  @autobg-aspect url('./assets/foo.png') w(0.78);
}
```

> 💡 **Tip**: In aspect mode, both numeric values and percentages are converted to percentage values. This differs from normal mode scaling behavior, where numeric values represent specific pixel values.

### 📋 Scaling Options Overview

| Option                     | Syntax                                        | Description                                                                                                                                   |
| -------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Width scaling              | `@autobg url(...) width(value)`               | Fixed width, height automatically calculated proportionally (value represents pixels or other specific units)                                 |
| Height scaling             | `@autobg url(...) height(value)`              | Fixed height, width automatically calculated proportionally (value represents pixels or other specific units)                                 |
| Overall scaling            | `@autobg url(...) scale(value or percentage)` | Scale both dimensions proportionally (numeric value represents scale ratio, percentage represents scale ratio)                                |
| Aspect ratio mode - width  | `@autobg-aspect url(...) width()`             | Generate width and set aspect-ratio, maintaining original image aspect ratio                                                                  |
| Aspect ratio mode - height | `@autobg-aspect url(...) height()`            | Generate height and set aspect-ratio, maintaining original image aspect ratio                                                                 |
| Aspect ratio mode - custom | `@autobg-aspect url(...) width(value)`        | Set width to specified ratio and maintain original image aspect ratio (both numeric values and percentages are treated as percentage values)  |
| Aspect ratio mode - custom | `@autobg-aspect url(...) height(value)`       | Set height to specified ratio and maintain original image aspect ratio (both numeric values and percentages are treated as percentage values) |

## ⚠️ Notes

If you encounter `css(unknownAtRules)` warnings, please refer to the following solution:

- [Solve CSS unknownAtRules errors in Vue.js projects](https://stackoverflow.com/questions/71648391/duplicate-unknown-at-rule-apply-cssunknownatrules-errors-in-vue-js-project)

## 📝 Configuration Options

| Option     | Type                     | Default Value                                  | Description                                                                                                               |
| ---------- | ------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| publicPath | `string`                 | `'public'`                                     | Static resource directory path, must match the build tool configuration                                                   |
| alias      | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, must match the build tool configuration<br>If not using path aliases, pass an empty object `{}` |

## 📄 License

MIT
