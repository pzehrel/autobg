# 🎨 @autobg/babel.macro

一个基于 [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) 的宏工具，专为 [styled-components](https://styled-components.com/) 设计。通过简单的本地图片路径，自动获取图片尺寸并设置相应的 CSS 样式。

## ✨ 核心特性

- 🚀 支持 Vite 和 Webpack 构建工具
- 🔄 识别图片尺寸并自动应用
- 📍 灵活支持相对路径和路径别名
- 📐 支持多种灵活的缩放模式
- 🎨 提供常规和 aspect-ratio 两种模式
- 📏 支持单位转换（px、rem、vw）

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
      }],
      ['babel-plugin-styled-components', { displayName: true }],
    ],
  },
} satisfies CracoConfig
```

> **注意**：以上 Webpack 配置示例使用 craco，但同样适用于其他 Webpack 配置，只要确保正确配置了 babel 插件即可。

## 🎯 使用指南

### 基础用法

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  /* 基本用法 - 自动设置背景图和尺寸 */
  ${autobg('@/assets/foo.png')}
`
```

### 等比缩放

#### 固定宽度或高度

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  /* 固定宽度，高度按比例自动计算 */
  ${autobg('@/assets/foo.png', 'w', 100)}
  ${autobg('@/assets/foo.png', 'width', 100)}

  /* 固定高度，宽度按比例自动计算 */
  ${autobg('@/assets/foo.png', 'h', 100)}
  ${autobg('@/assets/foo.png', 'height', 100)}
`
```

#### 整体缩放比例

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  /* 数值形式（0.75倍缩放） */
  ${autobg('@/assets/foo.png', 0.75)}
  ${autobg('@/assets/foo.png', 's', 0.75)}
  ${autobg('@/assets/foo.png', 'scale', 0.75)}

  /* 百分比形式（缩放至75%） */
  ${autobg('@/assets/foo.png', '75%')}
  ${autobg('@/assets/foo.png', 's', '75%')}
  ${autobg('@/assets/foo.png', 'scale', '75%')}
`
```

### 使用 aspect-ratio 属性

利用现代 CSS 的 [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) 属性保持元素宽高比，实现更灵活的布局控制。

特别适用于需要响应式缩放的场景，当父元素尺寸动态变化时尤为有效：

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

// 父元素高度可能会动态变化
const Parent = styled.div`
  height: 200px;
`

// 子元素会自动保持图片原始宽高比并适应父元素
const Child = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'height')}
`

export function Component() {
  return (
    <Parent>
      <Child />
    </Parent>
  )
}
```

当父元素的高度发生变化时，子元素会自动保持原始图片的宽高比例，实现等比例缩放。

#### 基础用法

不指定宽高时，仅生成背景和宽高比，需要手动添加宽度或高度：

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

const Foo = styled.div`
  /* 需要手动设置宽度或高度 */
  ${autobg.aspect('@/assets/foo.png')}
  width: 100%;
`
```

#### 指定生成宽度或高度

自动生成一个维度的值（默认100%），并保持原图宽高比：

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

// 生成高度，保持原图宽高比
const HeightAuto = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'height')}
  ${autobg.aspect('@/assets/foo.png', 'h')}
`

// 生成宽度，保持原图宽高比
const WidthAuto = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'width')}
  ${autobg.aspect('@/assets/foo.png', 'w')}
`
```

#### 自定义比例

提供百分比或小数值，精确设置对应维度：

```tsx
import autobg from '@autobg/babel.macro'
import { styled } from 'styled-components'

// 设置高度为78%，宽度按比例计算
const HeightCustom = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'height', '78%')}
  ${autobg.aspect('@/assets/foo.png', 'h', 0.78)}
`

// 设置宽度为78%，高度按比例计算
const WidthCustom = styled.div`
  ${autobg.aspect('@/assets/foo.png', 'width', '78%')}
  ${autobg.aspect('@/assets/foo.png', 'w', 0.78)}
`
```

> 💡 **提示**：在 aspect 模式下，数值和百分比都会被换算为百分比值。这与普通模式下的缩放行为不同，普通模式中数值表示具体像素值。

### 📋 缩放选项总览

| 选项              | 语法                                | 功能描述                                                           |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------ |
| 宽度缩放          | `autobg(path, 'width', 值)`         | 固定宽度，高度按比例自动计算（值表示像素等具体单位）               |
| 高度缩放          | `autobg(path, 'height', 值)`        | 固定高度，宽度按比例自动计算（值表示像素等具体单位）               |
| 整体缩放          | `autobg(path, 值或百分比)`          | 按比例统一缩放两个维度（数值表示缩放比例，百分比表示缩放比例）     |
| 宽高比模式-宽度   | `autobg.aspect(path, 'width')`      | 生成宽度并设置 aspect-ratio，保持原图宽高比                        |
| 宽高比模式-高度   | `autobg.aspect(path, 'height')`     | 生成高度并设置 aspect-ratio，保持原图宽高比                        |
| 宽高比模式-自定义 | `autobg.aspect(path, 'width', 值)`  | 设置宽度为指定比例并保持原图宽高比（数值和百分比都被视为百分比值） |
| 宽高比模式-自定义 | `autobg.aspect(path, 'height', 值)` | 设置高度为指定比例并保持原图宽高比（数值和百分比都被视为百分比值） |

> 💡 **提示**：使用路径别名或 `public` 目录下的图片时，需要确保 `alias` 和 `publicPath` 配置与构建工具配置保持一致。

## 📝 配置项说明

| 配置项        | 类型                        | 默认值                                         | 说明                                                                          |
| ------------- | --------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| publicPath    | `string`                    | `'public'`                                     | 静态资源目录路径，需要与构建工具配置保持一致                                  |
| alias         | `Record<string, string>`    | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | 路径别名配置，需要与构建工具配置保持一致<br>不使用路径别名时，传入空对象 `{}` |
| unit          | `'px'` \| `'rem'` \| `'vw'` | `'px'`                                         | CSS 单位类型                                                                  |
| rootValue     | `number`                    | `100`                                          | 根元素字体大小（仅在 `unit` 为 `'rem'` 时生效）                               |
| designWidth   | `number`                    | `750`                                          | 设计稿宽度（仅在 `unit` 为 `'vw'` 时生效）                                    |
| unitPrecision | `number`                    | `5`                                            | `px` 转换为 `rem` 或 `vw` 时的精度（小数位数）                                |

## 📄 许可证

MIT
