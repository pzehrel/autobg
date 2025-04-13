# @autobg/unocss

[中文](./README.zh-CN.md)

A tool for automatically setting element dimensions based on background image size, built on top of [unocss](https://github.com/unocss/unocss).

Automatically get image dimensions and apply corresponding CSS styles with simple local image paths, no manual width/height calculations needed.

## ✨ Features

- 🚀 Vite support
- 🔄 Automatic image dimension detection and application
- 📍 Support for relative paths and path aliases
- 🎨 Seamless integration with UnoCSS

> ⚠️ Note: Currently not compatible with `unocss@66.1.0` as it's in beta stage with preset mechanism changes.

## 📦 Installation

```bash
pnpm add @autobg/unocss
```

## ⚙️ Configuration

### Vite Configuration

```ts
// uno.config.ts
import { autobgPreset } from '@autobg/unocss'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    autobgPreset(),
  ],
})
```

### Webpack Support

Currently not supported for the following reasons:
- Paths processed by Webpack's transformer cannot be correctly resolved
- UnoCSS's official `bg-[url()]` rule also doesn't work properly with Webpack

## 🎯 Usage Examples

```tsx
export function Component() {
  return (
    <>
      {/* Using path alias */}
      <div className="autobg-['url(@/assets/foo.png)']" />

      {/* Using relative path */}
      <div className="autobg-['url(./assets/foo.png)']" />

      {/* Using image from public directory */}
      <div className="autobg-['url(/foo.png)']" />

      {/* Scale to specific width while preserving aspect ratio */}
      <div className="autobg-['url(./assets/foo.png')]-w200" />
      <div className="autobg-['url(./assets/foo.png')]-w-200" />

      {/* Scale to specific height while preserving aspect ratio */}
      <div className="autobg-['url(./assets/foo.png')]-h200" />
      <div className="autobg-['url(./assets/foo.png')]-h-200" />

      {/* Apply uniform scaling (number) */}
      <div className="autobg-['url(./assets/foo.png')]-0.78" />

      {/* Apply uniform scaling (percentage) */}
      <div className="autobg-['url(./assets/foo.png')]-78%" />
    </>
  )
}
```

> 💡 Tip: When using path aliases or images from the `public` directory, ensure that `alias` and `publicPath` configurations match your build tool settings.

### Scaling Options

You can scale images while preserving the original aspect ratio using the following options:

| Option | Format | Description |
| --- | --- | --- |
| Width scaling | `autobg-['url(...)']-w{number}` or `autobg-['url(...)']-w-{number}` | Scale to specific width. Height will be automatically calculated to maintain aspect ratio. |
| Height scaling | `autobg-['url(...)']-h{number}` or `autobg-['url(...)']-h-{number}` | Scale to specific height. Width will be automatically calculated to maintain aspect ratio. |
| Uniform scaling (number) | `autobg-['url(...)']-{number}` | Apply uniform scaling to both dimensions using a number value (e.g., 0.78). |
| Uniform scaling (percentage) | `autobg-['url(...)']-{percentage}%` | Apply uniform scaling to both dimensions using a percentage value (e.g., 78%). |

## 📝 Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| publicPath | `string` | `'public'` | Path to the public directory, should match build tool configuration |
| alias | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, should match build tool configuration. Pass an empty object `{}` if not using path aliases |
| root | `string` | `undefined` | The root directory path of the project. If not provided, the correct style class preview cannot be displayed in the VSCode unocss extension |

## License

MIT
