# @autobg/postcss

[English](./README.md)

一个基于 [PostCSS](https://postcss.org/) 的插件，提供了名为 `@autobg` 的 [AtRule](https://postcss.org/api/#atrule)。通过简单的图片路径声明，即可自动设置元素的宽高为图片的实际尺寸。

## ✨ 特性

- 🚀 支持 Vite 和 Webpack 构建工具
- 🔄 自动获取并应用图片尺寸
- 🔍 支持路径别名配置

## 📦 安装

```bash
pnpm add @autobg/postcss
```

## ⚙️ 配置

### Vite 配置

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

### Webpack 配置

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

> 注意：以上 Webpack 配置示例使用 craco，但同样适用于其他 Webpack 配置。

## 🎯 使用示例

```css
.foo {
  @autobg url('./assets/foo.png');

  /* 缩放到特定宽度，同时保留长宽比 */
  @autobg url('./assets/foo.png') width(100px);
  @autobg url('./assets/foo.png') w(100px);

  /* 缩放到特定高度，同时保留长宽比 */
  @autobg url('./assets/foo.png') height(100px);
  @autobg url('./assets/foo.png') h(100px);

  /* 应用均匀缩放（数字） */
  @autobg url('./assets/foo.png') scale(0.78);
  @autobg url('./assets/foo.png') s(0.78);

  /* 应用均匀缩放（百分比） */
  @autobg url('./assets/foo.png') scale(78%);
  @autobg url('./assets/foo.png') s(78%);
}
```

## ⚠️ 注意事项

如果遇到 `css(unknownAtRules)` 警告，请参考以下解决方案：

- [解决 Vue.js 项目中的 CSS unknownAtRules 错误](https://stackoverflow.com/questions/71648391/duplicate-unknown-at-rule-apply-cssunknownatrules-errors-in-vue-js-project)

## 📝 配置项说明

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| publicPath | `string` | `'public'` | 静态资源目录路径，需要与构建工具配置保持一致 |
| alias | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | 路径别名配置，需要与构建工具配置保持一致。不使用路径别名时，传入空对象 `{}` |
| unit | `'px'` \| `'rem'` \| `'vw'` | `'px'` | CSS 单位类型 |
| rootValue | `number` | `100` | 根元素字体大小（仅在 `unit` 为 `'rem'` 时生效） |
| designWidth | `number` | `750` | 设计稿宽度（仅在 `unit` 为 `'vw'` 时生效） |
| unitPrecision | `number` | `5` | `px` 转换为 `rem` 或 `vw` 时的精度（小数位数） |

## 📄 许可证

MIT
