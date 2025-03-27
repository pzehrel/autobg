根据给定的图像路径自动生成背景图像、宽度、高度的css代码

受 [littlee/autobg.macro](https://github.com/littlee/autobg.macro) 项目的启发，增加了 unocss 版本

## 特性

- 支持 Babel Macro 和 UnoCSS 两种使用方式
- 自动计算背景图片的宽高比
- 支持 webpack 和 vite
- 支持路径别名
- 支持相对路径和绝对路径
- 支持自定义单位和设计稿宽度

## 安装

### Babel Macro 版本

```bash
pnpm install @autobg/babel.macro
```

### UnoCSS 版本

```bash
pnpm install @autobg/unocss
```

## 使用

### Babel Macro 版本

创建配置文件：
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

使用示例：
```ts
import { autobg } from '@autobg/babel.macro'
import { styled } from 'styled-components'

styled.div`
  ${autobg('@/assets/test.png')}
`
```

### UnoCSS 版本

配置 UnoCSS：
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

使用示例：
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

> 转换器会将相对路径转换为绝对路径或相对于项目根目录的路径别名路径，然后传递给 vite 或 webpack 转换为编译后的文件路径

## 配置选项

配置选项请参考：
- [babel-macro/src/config.ts](https://github.com/pzehrel/autobg/blob/main/packages/babel-macro/src/config.ts)
- [unocss/src/config.ts](https://github.com/pzehrel/autobg/blob/main/packages/unocss/src/config.ts)
- [shared/src/config.ts](https://github.com/pzehrel/autobg/blob/main/packages/shared/src/config.ts)

## 许可证

MIT
