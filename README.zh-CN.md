# 🎨 autobg

这是一个CSS工具库，它能够根据提供的本地图片路径，自动为元素生成`background-image`、`width`和`height`的样式代码。

💡 灵感来源于[littlee/autobg.macro](https://github.com/littlee/autobg.macro)项目。

✨ 现已支持多种使用方式。

## 🚀 功能特点

- 🖼️ 自动为元素生成符合图片原始宽高比的样式代码
- 🛠️ 支持多种使用方式：
  - [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) 插件
  - [unocss](https://github.com/unocss/unocss) 预设
  - [postcss](https://github.com/postcss/postcss) 插件
- 🔄 完全兼容 [webpack](https://github.com/webpack/webpack) 和 [vite](https://github.com/vitejs/vite)
- 🔗 在 unocss 和 vite 中支持相对路径引入图片 [unocss #1397](https://github.com/unocss/unocss/issues/1397)
- 📏 在 babel 宏中支持自定义样式单位

## 📖 使用方式

详细使用说明请查看对应文档：

- 📦 [@autobg/babel.macro](./packages/babel-macro/README.zh-CN.md)
- 🎨 [@autobg/unocss](./packages/unocss/README.zh-CN.md)
- 🔧 [@autobg/postcss](./packages/postcss/README.zh-CN.md)

## 📄 许可证

MIT
