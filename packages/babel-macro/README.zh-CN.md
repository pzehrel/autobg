# @autobg/babel.macro

一个基于 [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) 的智能宏工具，专为 [styled-components](https://styled-components.com/) 设计。

通过简单的本地图片路径，即可自动获取图片尺寸并设置相应的 CSS 样式。

## ✨ 特性

- 🚀 支持 Vite 和 Webpack
- 🔄 自动处理图片尺寸

## 📦 安装

```bash
pnpm add @autobg/babel-macro babel-plugin-macros styled-components
```

## ⚙️ 配置

### Vite 配置

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

### Webpack 配置

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
      // 你也可以用 .babel-plugin-macrosrc.js
      ['babel-plugin-macros', {
        autobg: defineAutobgMacro({
          unit: 'px',
        }),
      }]
      ['babel-plugin-styled-components', { displayName: true }],
    ],
  },
} satisfies CracoConfig
```

> 注意：以上 Webpack 配置示例使用 craco，但同样适用于其他 Webpack 配置，只要确保正确配置了 babel 插件即可。

## 🎯 使用示例

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  ${autobg('@/assets/foo.png')}
`

export function Component() {
  return <Foo />
}
```

> 提示：使用路径别名或 `public` 目录下的图片时，需要确保 `alias` 和 `publicPath` 配置与 Webpack 配置保持一致。

## 📝 配置项说明

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| publicPath | `string` | `'public'` | public 目录路径，需要与构建工具配置保持一致 |
| alias | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | 路径别名配置，需要与构建工具配置保持一致。不使用路径别名时，传入空对象 `{}` |
| unit | `'px'` \| `'rem'` \| `'vw'` | `'px'` | CSS 单位类型 |
| rootValue | `number` | `100` | 根元素字体大小（仅在 `unit` 为 `'rem'` 时生效） |
| designWidth | `number` | `750` | 设计稿宽度（仅在 `unit` 为 `'vw'` 时生效） |
| unitPrecision | `number` | `5` | `px` 转换为 `rem` 或 `vw` 时的精度（小数位数） |

## 许可证

MIT
