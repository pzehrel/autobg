# 🎨 @autobg/postcss

一个基于 [PostCSS](https://postcss.org/) 的插件，提供了名为 `@autobg` 和 `@autobg-aspect` 的 [AtRule](https://postcss.org/api/#atrule)。通过简单的图片路径声明，即可自动设置元素的背景图片和尺寸。

## ✨ 核心特性

- 🚀 支持 Vite 和 Webpack 构建工具
- 🔄 识别图片尺寸并自动应用
- 📍 灵活支持相对路径和路径别名
- 📐 支持多种灵活的缩放模式
- 🎨 提供 `@autobg` 和 `@autobg-aspect` 两种模式

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

> **注意**：以上 Webpack 配置示例使用 craco，但同样适用于其他 Webpack 配置。

## 🎯 使用指南

### 基础用法

```css
.foo {
  /* 基本用法 - 自动设置背景图和尺寸 */
  @autobg url('./assets/foo.png');
}
```

### 等比缩放

#### 固定宽度或高度

```css
.foo {
  /* 固定宽度，高度按比例计算 */
  @autobg url('./assets/foo.png') width(100px);
  @autobg url('./assets/foo.png') w(100px);

  /* 固定高度，宽度按比例计算 */
  @autobg url('./assets/foo.png') height(100px);
  @autobg url('./assets/foo.png') h(100px);
}
```

#### 整体缩放比例

```css
.foo {
  /* 应用均匀缩放（数字） */
  @autobg url('./assets/foo.png') scale(0.78);
  @autobg url('./assets/foo.png') s(0.78);

  /* 应用均匀缩放（百分比） */
  @autobg url('./assets/foo.png') scale(78%);
  @autobg url('./assets/foo.png') s(78%);
}
```

### 使用 aspect-ratio 属性

利用现代 CSS 的 [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) 属性保持元素宽高比，实现更灵活的布局控制。

特别适用于需要响应式缩放的场景，当父元素尺寸动态变化时尤为有效：

```css
/* 父元素高度可能会动态变化 */
.parent {
  height: 200px;
}

.child {
  /* 子元素会自动保持图片原始宽高比并适应父元素 */
  @autobg-aspect url('./assets/foo.png') height();
}
```

当父元素的高度发生变化时，子元素会自动保持原始图片的宽高比例，实现等比例缩放。

#### 基础用法

不指定宽高时，仅生成背景和宽高比，需要手动添加宽度或高度：

```css
.foo {
  @autobg-aspect url('./assets/foo.png');
  /* 需要手动设置宽度或高度 */
  width: 100%;
}
```

#### 指定生成宽度或高度

自动生成一个维度的值（默认100%），并智能保持原图宽高比：

```css
.foo {
  /* 生成高度，保持原图宽高比 */
  @autobg-aspect url('./assets/foo.png') height();
  @autobg-aspect url('./assets/foo.png') h();

  /* 生成宽度，保持原图宽高比 */
  @autobg-aspect url('./assets/foo.png') width();
  @autobg-aspect url('./assets/foo.png') w();
}
```

> 💡 **注意**：所有方法参数都必须带括号，即使不传入具体数值。例如必须使用 `height()` 而不是 `height`，这是 PostCSS AtRule 函数调用的语法要求。

#### 自定义比例

提供百分比或小数值，精确设置对应维度：

```css
.foo {
  /* 设置高度为78%，宽度按比例计算 */
  @autobg-aspect url('./assets/foo.png') height(78%);
  @autobg-aspect url('./assets/foo.png') h(0.78);

  /* 设置宽度为78%，高度按比例计算 */
  @autobg-aspect url('./assets/foo.png') width(78%);
  @autobg-aspect url('./assets/foo.png') w(0.78);
}
```

> 💡 **提示**：在 aspect 模式下，数值和百分比都会被换算为百分比值。这与普通模式下的缩放行为不同，普通模式中数值表示具体像素值。

### 📋 缩放选项总览

| 选项              | 语法                                 | 功能描述                                                           |
| ----------------- | ------------------------------------ | ------------------------------------------------------------------ |
| 宽度缩放          | `@autobg url(...) width(值)`         | 固定宽度，高度按比例自动计算（值表示像素等具体单位）               |
| 高度缩放          | `@autobg url(...) height(值)`        | 固定高度，宽度按比例自动计算（值表示像素等具体单位）               |
| 整体缩放          | `@autobg url(...) scale(值或百分比)` | 按比例统一缩放两个维度（数值表示缩放比例，百分比表示缩放比例）     |
| 宽高比模式-宽度   | `@autobg-aspect url(...) width()`    | 生成宽度并设置 aspect-ratio，保持原图宽高比                        |
| 宽高比模式-高度   | `@autobg-aspect url(...) height()`   | 生成高度并设置 aspect-ratio，保持原图宽高比                        |
| 宽高比模式-自定义 | `@autobg-aspect url(...) width(值)`  | 设置宽度为指定比例并保持原图宽高比（数值和百分比都被视为百分比值） |
| 宽高比模式-自定义 | `@autobg-aspect url(...) height(值)` | 设置高度为指定比例并保持原图宽高比（数值和百分比都被视为百分比值） |

## ⚠️ 注意事项

如果遇到 `css(unknownAtRules)` 警告，请参考以下解决方案：

- [解决 Vue.js 项目中的 CSS unknownAtRules 错误](https://stackoverflow.com/questions/71648391/duplicate-unknown-at-rule-apply-cssunknownatrules-errors-in-vue-js-project)

## 📝 配置项说明

| 配置项     | 类型                     | 默认值                                         | 说明                                                                          |
| ---------- | ------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| publicPath | `string`                 | `'public'`                                     | 静态资源目录路径，需要与构建工具配置保持一致                                  |
| alias      | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | 路径别名配置，需要与构建工具配置保持一致<br>不使用路径别名时，传入空对象 `{}` |

## 📄 许可证

MIT
