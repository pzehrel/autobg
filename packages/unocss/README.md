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
    </>
  )
}
```

> 💡 Tip: When using path aliases or images from the `public` directory, ensure that `alias` and `publicPath` configurations match your build tool settings.

## 📝 Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| publicPath | `string` | `'public'` | Path to the public directory, should match build tool configuration |
| alias | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | Path alias configuration, should match build tool configuration. Pass an empty object `{}` if not using path aliases |

## License

MIT
