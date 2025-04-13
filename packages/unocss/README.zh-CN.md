# @autobg/unocss

一个基于 [unocss](https://github.com/unocss/unocss) 的背景图片设置元素宽高工具。

通过简单的本地图片路径，即可自动获取图片尺寸并设置相应的 CSS 样式，无需手动计算和设置宽高。

## ✨ 特性

- 🚀 支持 Vite 构建工具
- 🔄 自动获取并应用图片尺寸
- 📍 支持相对路径和路径别名
- 🎨 与 UnoCSS 完美集成

> ⚠️ 注意：暂不支持 `unocss@66.1.0` 版本，该版本处于 beta 阶段，preset 机制有所变化。

## 📦 安装

```bash
pnpm add @autobg/unocss
```

## ⚙️ 配置

### Vite 配置

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

### Webpack 支持说明

目前暂不支持 Webpack，原因如下：
- Webpack 的 transformer 处理后的路径无法被正确解析
- UnoCSS 官方提供的 `bg-[url()]` 规则在 Webpack 中同样无法正常工作

## 🎯 使用示例

```tsx
export function Component() {
  return (
    <>
      {/* 使用路径别名 */}
      <div className="autobg-['url(@/assets/foo.png)']" />

      {/* 使用相对路径 */}
      <div className="autobg-['url(./assets/foo.png)']" />

      {/* 使用 public 目录下的图片 */}
      <div className="autobg-['url(/foo.png)']" />

      {/* 指定宽度等比缩放 */}
      <div className="autobg-['url(./assets/foo.png')]-w200" />
      <div className="autobg-['url(./assets/foo.png')]-w-200" />

      {/* 指定高度等比缩放 */}
      <div className="autobg-['url(./assets/foo.png')]-h200" />
      <div className="autobg-['url(./assets/foo.png')]-h-200" />

      {/* 使用数值进行统一缩放 */}
      <div className="autobg-['url(./assets/foo.png')]-0.78" />

      {/* 使用百分比进行统一缩放 */}
      <div className="autobg-['url(./assets/foo.png')]-78%" />
    </>
  )
}
```

> 💡 提示：使用路径别名或 `public` 目录下的图片时，请确保 `alias` 和 `publicPath` 配置与构建工具配置保持一致。

### 缩放选项

您可以使用以下选项来保持原始宽高比（等比）缩放图片：

| 选项 | 格式 | 说明 |
| --- | --- | --- |
| 宽度缩放 | `autobg-['url(...)']-w{数值}` 或 `autobg-['url(...)']-w-{数值}` | 指定宽度，将自动计算高度以保持原始宽高比 |
| 高度缩放 | `autobg-['url(...)']-h{数值}` 或 `autobg-['url(...)']-h-{数值}` | 指定高度，将自动计算宽度以保持原始宽高比 |
| 统一缩放（数值） | `autobg-['url(...)']-{数值}` | 使用数值（如 0.78）统一缩放两个维度 |
| 统一缩放（百分比） | `autobg-['url(...)']-{百分比}%` | 使用百分比值（如 78%）统一缩放两个维度 |

## 📝 配置项说明

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| publicPath | `string` | `'public'` | public 目录路径，需要与构建工具配置保持一致 |
| alias | `Record<string, string>` | `{ '@/': 'src/', '~': 'src/', '~@/': 'src/' }` | 路径别名配置，需要与构建工具配置保持一致。不使用路径别名时，传入空对象 `{}` |
| root | `string` | `undefined` | 项目根目录路径，如果不提供，则无法在 VSCode unocss 扩展中显示正确的样式类预览 |

## 许可证

MIT
