# 🎨 @autobg/unocss

一个 UnoCSS 预设插件，能够根据本地图片路径自动生成完整的背景样式（包含 `background-image`、`width` 和 `height` 属性），让您的开发工作事半功倍。

## ✨ 核心特性

- 🚀 完美支持 Vite 构建工具
- 🔄 识别图片尺寸并自动应用
- 📍 灵活支持相对路径和路径别名
- 🎨 与 UnoCSS 生态系统无缝集成
- 📐 支持多种灵活的缩放模式

> ⚠️ **注意**：暂不支持 `unocss@66.1.0` 版本，该版本处于 beta 阶段，preset 机制有所变化。

## 📦 安装

```bash
pnpm add @autobg/unocss
```

## ⚙️ 配置

### Vite 项目

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

### Webpack 支持说明

目前暂不支持 Webpack，主要原因：

- Webpack 的 transformer 处理机制导致路径无法正确替换
- UnoCSS 官方的 `bg-[url()]` 规则在 Webpack 环境中同样存在兼容性问题

## 🎯 使用指南

### 基础用法

轻松指定背景图片路径：

```tsx
<div className="autobg-['url(/foo.png)']" />
<div className="autobg-['url(@/assets/foo.png)']" />
<div className="autobg-['url(../assets/foo.png)']" />
```

### 等比缩放

#### 固定宽度或高度

指定一个维度，另一个维度将按原图比例自动计算：

```tsx
// 指定宽度
<div className="autobg-['url(/foo.png)']-w200" />

// 使用分隔符连接数值
<div className="autobg-['url(/foo.png)']-w-200" />

// 指定高度
<div className="autobg-['url(/foo.png)']-h200" />

// 使用分隔符连接数值
<div className="autobg-['url(/foo.png)']-h-200" />
```

> 💡 **提示**：暂不支持样式单位（如 `px`、`rem` 等），这会导致缩放比例无法正确计算。
> 特别注意 `w-200` 中的 `-` 仅作为分隔符，不表示负值。

#### 百分比缩放

使用百分比值控制缩放比例：

```tsx
// 宽度百分比
<div className="autobg-['url(/foo.png)']-w78%" />

// 高度百分比
<div className="autobg-['url(/foo.png)']-h78%" />
```

> 💡 **提示**：百分比必须以 `%` 结尾，否则将被视为普通数值。

#### 整体缩放比例

不指定具体维度时，将按整体比例均匀调整：

```tsx
// 小数形式（0.78倍缩放）
<div className="autobg-['url(/foo.png)']-0.78" />

// 百分比形式（缩放至78%）
<div className="autobg-['url(/foo.png)']-78%" />
```

### 使用 aspect-ratio 属性

利用现代 CSS 的 [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) 属性保持元素宽高比，实现更灵活的布局控制。

特别适用于需要响应式缩放的场景，当父元素尺寸动态变化时尤为有效：

```tsx
// 父元素高度可能会动态变化
<div className="h200">
  {/* 子元素会自动保持图片原始宽高比并适应父元素 */}
  <div className="autobg-aspect-['url(/foo.png)']-h"></div>
</div>
```

当父元素的高度发生变化时，子元素会自动保持原始图片的宽高比例，实现等比例缩放。

#### 基础用法

不指定宽高时，仅生成背景和宽高比，需要手动添加宽度或高度：

```tsx
<div className="autobg-aspect-['url(/foo.png)']" />
```

#### 指定生成宽度或高度

自动生成一个维度的值（默认100%），并智能保持原图宽高比：

```tsx
// 生成高度，保持原图宽高比
<div className="autobg-aspect-['url(/foo.png)']-h" />

// 生成宽度，保持原图宽高比
<div className="autobg-aspect-['url(/foo.png)']-w" />
```

#### 自定义比例

提供百分比或小数值，精确设置对应维度：

```tsx
// 设置高度为78%，宽度按比例计算
<div className="autobg-aspect-['url(/foo.png)']-h-78%" />
<div className="autobg-aspect-['url(/foo.png)']-h-0.78" />

// 设置宽度为78%，高度按比例计算
<div className="autobg-aspect-['url(/foo.png)']-w-78%" />
<div className="autobg-aspect-['url(/foo.png)']-w-0.78" />
```

> 💡 **提示**：在 aspect 模式下，数值和百分比都会被换算为百分比值。这与普通模式下的缩放行为不同，普通模式中数值表示具体像素值。

### 📋 缩放选项总览

| 选项              | 语法                                  | 功能描述                                                           |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------ |
| 宽度缩放          | `autobg-['url(...)']-w{数值}`         | 固定宽度，高度按比例自动计算（数值表示像素值）                     |
| 高度缩放          | `autobg-['url(...)']-h{数值}`         | 固定高度，宽度按比例自动计算（数值表示像素值）                     |
| 整体缩放          | `autobg-['url(...)']-{数值或百分比}`  | 按比例统一缩放两个维度（数值表示像素值，百分比表示缩放比例）       |
| 宽高比模式-宽度   | `autobg-aspect-['url(...)']-w`        | 生成宽度并设置 aspect-ratio，保持原图宽高比                        |
| 宽高比模式-高度   | `autobg-aspect-['url(...)']-h`        | 生成高度并设置 aspect-ratio，保持原图宽高比                        |
| 宽高比模式-自定义 | `autobg-aspect-['url(...)']-w-{数值}` | 设置宽度为指定比例并保持原图宽高比（数值和百分比都被视为百分比值） |
| 宽高比模式-自定义 | `autobg-aspect-['url(...)']-h-{数值}` | 设置高度为指定比例并保持原图宽高比（数值和百分比都被视为百分比值） |

## ⚙️ 配置项详解

| 配置项     | 类型                     | 默认值                                         | 说明                                                                          |
| ---------- | ------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| publicPath | `string`                 | `'public'`                                     | public 目录路径，需与构建工具配置保持一致                                     |
| alias      | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | 路径别名配置，需与构建工具配置保持一致<br>若不使用路径别名，请传入空对象 `{}` |
| root       | `string`                 | `undefined`                                    | 项目根目录路径<br>若不提供，将无法在 VSCode unocss 扩展中正确预览样式类       |

## 📄 许可证

MIT
