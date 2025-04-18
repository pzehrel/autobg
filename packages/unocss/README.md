# 🎨 @autobg/unocss

[![npm version](https://img.shields.io/npm/v/@autobg/unocss.svg?style=flat)](https://www.npmjs.com/package/@autobg/unocss)
[![npm downloads](https://img.shields.io/npm/dm/@autobg/unocss.svg?style=flat)](https://www.npmjs.com/package/@autobg/unocss)

[中文](./README.zh-CN.md)

> A UnoCSS preset that generates complete background image and size styles based on local image path.

## ✨ Core Features

- 🚀 **Perfect support** for Vite build tool
- 🔄 **Smart recognition** of image dimensions and automatic application
- 📍 **Flexible support** for relative paths and path aliases
- 🎨 **Seamless integration** with UnoCSS ecosystem
- 📐 **Multiple modes** offering flexible scaling options

> ⚠️ **Note**: Currently not supporting `unocss@66.1.0` version, which is in beta stage with changed preset mechanism.

## 📦 Installation

```bash
pnpm add @autobg/unocss
```

## ⚙️ Configuration

### Vite Projects

```ts
// uno.config.ts
import { autobgPreset } from '@autobg/unocss'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    autobgPreset({
      // Use absolute path instead of process.cwd().
      // Since VSCode's unocss extension doesn't pass the project root path when calling the preset's transformer.
      // This will cause incorrect code highlighting suggestions, but won't affect the actual class name generation.
      root: import.meta.env.dirname,

      // Transform width and height values, can add style units
      // Default will convert to `px` unit
      // This is a temporary solution and may be deprecated in the future
      transformSize: value => `${value}px`,
    }),
  ],
})
```

### Webpack Support Notes

Currently Webpack is not supported, mainly because:

- Webpack's transformer handling mechanism prevents correct path replacement
- UnoCSS official `bg-[url()]` rule also has compatibility issues in Webpack environment

## 🎯 Usage Guide

### Basic Usage

Easily specify background image path:

```tsx
<div className="autobg-['url(/foo.png)']" />
<div className="autobg-['url(@/assets/foo.png)']" />
<div className="autobg-['url(../assets/foo.png)']" />
```

### Proportional Scaling

#### Fixed Width or Height

Specify one dimension, and the other will be automatically calculated based on the original image ratio:

```tsx
// Specify width
<div className="autobg-['url(/foo.png)']-w200" />

// Use separator to connect value
<div className="autobg-['url(/foo.png)']-w-200" />

// Specify height
<div className="autobg-['url(/foo.png)']-h200" />

// Use separator to connect value
<div className="autobg-['url(/foo.png)']-h-200" />
```

> 💡 **Tip**: Style units (such as `px`, `rem`, etc.) are not currently supported, as they would prevent correct scaling ratio calculation.
> Note that the `-` in `w-200` is only used as a separator, not indicating a negative value.

#### Percentage Scaling

Use percentage values to control scaling ratio:

```tsx
// Width percentage
<div className="autobg-['url(/foo.png)']-w78%" />

// Height percentage
<div className="autobg-['url(/foo.png)']-h78%" />
```

> 💡 **Tip**: Percentage must end with `%`, otherwise it will be treated as a regular value.

#### Overall Scaling Ratio

Without specifying a particular dimension, will adjust uniformly by overall ratio:

```tsx
// Decimal form (0.78x scaling)
<div className="autobg-['url(/foo.png)']-0.78" />

// Percentage form (scale to 78%)
<div className="autobg-['url(/foo.png)']-78%" />
```

### Using aspect-ratio Property

Utilize modern CSS [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) property to maintain element aspect ratio, enabling more flexible layout control.

Especially suitable for responsive scaling scenarios, particularly effective when parent element dimensions change dynamically:

```tsx
// Parent element height may change dynamically
<div className="h200">
  {/* Child element will automatically maintain the original image aspect ratio and adapt to the parent element */}
  <div className="autobg-aspect-['url(/foo.png)']-h"></div>
</div>
```

When the parent element's height changes, the child element will automatically maintain the original image's aspect ratio, achieving proportional scaling.

#### Basic Usage

Without specifying width/height, only generates background and aspect ratio:

```tsx
<div className="autobg-aspect-['url(/foo.png)']" />
```

#### 📐 Specify Generated Width or Height

Automatically generate one dimension (default 100%):

```tsx
// Generate height, maintain original image aspect ratio
<div className="autobg-aspect-['url(/foo.png)']-h" />

// Generate width, maintain original image aspect ratio
<div className="autobg-aspect-['url(/foo.png)']-w" />
```

#### Custom Ratio

Set width and height:

```tsx
<div className="autobg-aspect-['url(/foo.png)']-h78%" />
<div className="autobg-aspect-['url(/foo.png)']-h78" />
<div className="autobg-aspect-['url(/foo.png)']-h78rem" />

<div className="autobg-aspect-['url(/foo.png)']-w78%" />
<div className="autobg-aspect-['url(/foo.png)']-w78" />
<div className="autobg-aspect-['url(/foo.png)']-w78rem" />
```

> 💡 **Tip**: In aspect mode, values are set directly to width or height property without transformation.

## 📋 Rule Overview

| Option                     | Syntax                                | Description                                                      |
| -------------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| Width Scaling              | `autobg-['url(...)']-w{value}`        | Fixed width, height calculated by ratio (value in pixels)        |
| Height Scaling             | `autobg-['url(...)']-h{value}`        | Fixed height, width calculated by ratio (value in pixels)        |
| Overall Scaling            | `autobg-['url(...)']-{value or %}`    | Scale both dimensions proportionally (decimal or percentage)     |
| Aspect Ratio-Width         | `autobg-aspect-['url(...)']-w`        | Generate width and set aspect-ratio, keep original ratio         |
| Aspect Ratio-Height        | `autobg-aspect-['url(...)']-h`        | Generate height and set aspect-ratio, keep original ratio        |
| Aspect Ratio-Custom Width  | `autobg-aspect-['url(...)']-w{value}` | Set width to specified value and maintain original aspect ratio  |
| Aspect Ratio-Custom Height | `autobg-aspect-['url(...)']-h{value}` | Set height to specified value and maintain original aspect ratio |

## ⚙️ Configuration Options

| Option        | Type                                 | Default                                        | Description                                                                                                                          |
| ------------- | ------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| publicPath    | `string`                             | `'public'`                                     | Public directory path, should be consistent with build tool configuration                                                            |
| alias         | `Record<string, string>`             | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, should be consistent with build tool configuration<br>If not using path aliases, pass an empty object `{}` |
| root          | `string`                             | `undefined`                                    | Project root directory path<br>If not provided, cannot correctly preview style classes in VSCode unocss extension                    |
| transformSize | `(size: number) => string \| number` | `undefined`                                    | Transform width and height values, can add style units                                                                               |

## 📄 License

MIT
