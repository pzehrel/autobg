# autobg

一个用于生成与图片宽高比相匹配的 CSS 样式代码的工具，参考自 [littlee/autobg.macro](https://github.com/littlee/autobg.macro) 项目，现已支持多种使用方式。

## 功能特点

- 🎯 支持多种使用方式：
  - Babel Macro
  - UnoCSS 预设
  - PostCSS 插件
- 📐 自动计算并生成背景图片的宽高比样式
- 🛠️ 支持 webpack 和 vite 构建工具
- 🔗 支持路径别名配置
- 📍 支持相对路径和绝对路径
- ⚙️ 支持自定义单位和设计稿宽度（仅 babel 宏）

## 使用方式

详细使用说明请查看对应文档：

- [Babel Macro 使用文档](./packages/babel-macro/README.zh-CN.md)
- [UnoCSS 使用文档](./packages/unocss/README.zh-CN.md)
- [PostCSS 使用文档](./packages/postcss/README.zh-CN.md)

## 许可证

MIT
