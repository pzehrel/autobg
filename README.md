Automatically generate CSS code for background image, width, and height based on the given image path

[中文文档](https://github.com/pzehrel/autobg/blob/main/README.zh-CN.md)

Inspired by [littlee/autobg.macro](https://github.com/littlee/autobg.macro) project, added UnoCSS version

## Features

- Support both Babel Macro and UnoCSS usage
- Automatically calculate background image aspect ratio
- Support webpack and vite
- Support path aliases
- Support relative and absolute paths
- Support custom units and design width

## Installation

### Babel Macro Version

```bash
pnpm install @autobg/babel.macro
```

### UnoCSS Version

```bash
pnpm install @autobg/unocss
```

## Usage

### Babel Macro Version

Create configuration file:
```javascript
// ./babel-plugin-macros.config.js

const { defineAutobgMacro } = require('@autobg/babel.macro')

module.exports = {
  autobg: defineAutobgMacro({
    unit: 'vw',
    designWidth: 750,
  })
}
```

Usage example:
```ts
import { autobg } from '@autobg/babel.macro'
import { styled } from 'styled-components'

styled.div`
  ${autobg('@/assets/test.png')}
`
```

### UnoCSS Version

Configure UnoCSS:
```ts
// uno.config.ts

import { autobgPreset } from '@autobg/unocss'
import { defineConfig } from 'unocss'

export default defineConfig({
  preset: [
    autobgPreset()
  ]
})
```

Usage example:
```tsx
export function Component() {
  return (
    <>
      <div className="autobg-[url('@/assets/test.png')]" />
      <div className="autobg-[url('/test.png')]" />
      <div className="autobg-[url('../test.png')]" />
    </>
  )
}
```

> The transformer will convert relative paths to absolute paths or path alias paths relative to the project root, then pass them to vite or webpack to convert into compiled file paths

## Configuration Options

For configuration options, please refer to:
- [babel-macro/src/config.ts](https://github.com/pzehrel/autobg/blob/main/packages/babel-macro/src/config.ts)
- [unocss/src/config.ts](https://github.com/pzehrel/autobg/blob/main/packages/unocss/src/config.ts)
- [shared/src/config.ts](https://github.com/pzehrel/autobg/blob/main/packages/shared/src/config.ts)

## License

MIT
