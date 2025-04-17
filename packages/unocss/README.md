# 🎨 @autobg/unocss

[中文](./README.zh-CN.md)

A UnoCSS preset plugin that automatically generates complete background styles (including `background-image`, `width`, and `height` properties) based on local image paths, making your development work more efficient.

## ✨ Key Features

- 🚀 Perfect support for Vite build tool
- 🔄 Smart recognition of image dimensions and automatic application
- 📍 Flexible support for relative paths and path aliases
- 🎨 Seamless integration with the UnoCSS ecosystem
- 📐 Support for multiple flexible scaling modes

> ⚠️ **Note**: Currently does not support `unocss@66.1.0` version, which is in beta stage with changes to the preset mechanism.

## 📦 Installation

```bash
pnpm add @autobg/unocss
```

## ⚙️ Configuration

### Vite Project

```ts
// uno.config.ts
import { autobgPreset } from '@autobg/unocss'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    autobgPreset({
      root: import.meta.env.dirname,
    }),
  ],
})
```

### Webpack Support Status

Currently does not support Webpack, for the following reasons:

- Webpack's transformer processing mechanism prevents correct path replacement
- UnoCSS official `bg-[url()]` rule also has compatibility issues in Webpack environments

## 🎯 Usage Guide

### Basic Usage

Easily specify background image paths:

```tsx
<div className="autobg-['url(/foo.png)']" />
<div className="autobg-['url(@/assets/foo.png)']" />
<div className="autobg-['url(../assets/foo.png)']" />
```

### Proportional Scaling

#### Fixed Width or Height

Specify one dimension, and the other dimension will be automatically calculated according to the original image ratio:

```tsx
// Specify width
<div className="autobg-['url(/foo.png)']-w200" />

// Use separator to connect the value
<div className="autobg-['url(/foo.png)']-w-200" />

// Specify height
<div className="autobg-['url(/foo.png)']-h200" />

// Use separator to connect the value
<div className="autobg-['url(/foo.png)']-h-200" />
```

> 💡 **Tip**: Style units (such as `px`, `rem`, etc.) are not currently supported, as they would prevent the scaling ratio from being correctly calculated.
> Note that the `-` in `w-200` is only a separator, not indicating a negative value.

#### Percentage Scaling

Use percentage values to control the scaling ratio:

```tsx
// Width percentage
<div className="autobg-['url(/foo.png)']-w78%" />

// Height percentage
<div className="autobg-['url(/foo.png)']-h78%" />
```

> 💡 **Tip**: Percentages must end with `%`, otherwise they will be treated as regular values.

#### Overall Scale Ratio

When no specific dimension is specified, both dimensions will be uniformly adjusted according to the scale ratio:

```tsx
// Decimal form (0.78x scaling)
<div className="autobg-['url(/foo.png)']-0.78" />

// Percentage form (scale to 78%)
<div className="autobg-['url(/foo.png)']-78%" />
```

### Using the aspect-ratio Property

Utilize the modern CSS [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) property to maintain element aspect ratio, enabling more flexible layout control.

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

When width and height are not specified, only the background and aspect ratio are generated, requiring manual addition of width or height:

```tsx
<div className="autobg-aspect-['url(/foo.png)']" />
```

#### Specify Generated Width or Height

Automatically generate one dimension's value (default 100%), and intelligently maintain the original image's aspect ratio:

```tsx
// Generate height, maintain original image aspect ratio
<div className="autobg-aspect-['url(/foo.png)']-h" />

// Generate width, maintain original image aspect ratio
<div className="autobg-aspect-['url(/foo.png)']-w" />
```

#### Custom Ratio

Provide percentage or decimal values to precisely set the corresponding dimension:

```tsx
// Set height to 78%, width calculated proportionally
<div className="autobg-aspect-['url(/foo.png)']-h-78%" />
<div className="autobg-aspect-['url(/foo.png)']-h-0.78" />

// Set width to 78%, height calculated proportionally
<div className="autobg-aspect-['url(/foo.png)']-w-78%" />
<div className="autobg-aspect-['url(/foo.png)']-w-0.78" />
```

> 💡 **Tip**: In aspect mode, both numeric values and percentages are converted to percentage values. This differs from normal mode scaling behavior, where numeric values represent specific pixel values.

### 📋 Scaling Options Overview

| Option                     | Syntax                                      | Description                                                                                                                                   |
| -------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Width scaling              | `autobg-['url(...)']-w{value}`              | Fixed width, height automatically calculated proportionally (value represents pixels)                                                         |
| Height scaling             | `autobg-['url(...)']-h{value}`              | Fixed height, width automatically calculated proportionally (value represents pixels)                                                         |
| Overall scaling            | `autobg-['url(...)']-{value or percentage}` | Scale both dimensions proportionally (numeric value represents pixels, percentage represents scale ratio)                                     |
| Aspect ratio mode - width  | `autobg-aspect-['url(...)']-w`              | Generate width and set aspect-ratio, maintaining original image aspect ratio                                                                  |
| Aspect ratio mode - height | `autobg-aspect-['url(...)']-h`              | Generate height and set aspect-ratio, maintaining original image aspect ratio                                                                 |
| Aspect ratio mode - custom | `autobg-aspect-['url(...)']-w-{value}`      | Set width to specified ratio and maintain original image aspect ratio (both numeric values and percentages are treated as percentage values)  |
| Aspect ratio mode - custom | `autobg-aspect-['url(...)']-h-{value}`      | Set height to specified ratio and maintain original image aspect ratio (both numeric values and percentages are treated as percentage values) |

## ⚙️ Configuration Options

| Option     | Type                     | Default Value                                  | Description                                                                                                               |
| ---------- | ------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| publicPath | `string`                 | `'public'`                                     | Public directory path, must match the build tool configuration                                                            |
| alias      | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, must match the build tool configuration<br>If not using path aliases, pass an empty object `{}` |
| root       | `string`                 | `undefined`                                    | Project root directory path<br>If not provided, style classes cannot be correctly previewed in VSCode unocss extension    |

## 📄 License

MIT
