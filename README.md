# 🎨 autobg

[中文](./README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/@autobg/unocss.svg?style=flat)](https://www.npmjs.com/package/@autobg/unocss)

This is a CSS utility library that automatically generates `background-image`, `width`, and `height` styles for elements based on local image paths.

💡 Iterated from the [littlee/autobg.macro](https://github.com/littlee/autobg.macro)

## 🚀 Features

- 🖼️ Automatically generates styles that respect the original aspect ratio of images
- 🛠️ Supports multiple integration methods:
  - [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) plugin
  - [unocss](https://github.com/unocss/unocss) preset
  - [postcss](https://github.com/postcss/postcss) plugin
- 🔄 Fully compatible with [webpack](https://github.com/webpack/webpack) and [vite](https://github.com/vitejs/vite)
- 🔗 Supports relative path image imports in unocss and vite [unocss #1397](https://github.com/unocss/unocss/issues/1397)
- 📏 Supports custom style units in babel macro

## 📖 Usage

For detailed usage instructions, please check the corresponding documentation:

- 🎨 [@autobg/unocss](./packages/unocss/README.zh-CN.md) [![npm downloads](https://img.shields.io/npm/dm/@autobg/unocss.svg?style=flat)](https://www.npmjs.com/package/@autobg/unocss)
- 📦 [@autobg/babel.macro](./packages/babel-macro/README.zh-CN.md) [![npm downloads](https://img.shields.io/npm/dm/@autobg/babel.macro.svg?style=flat)](https://www.npmjs.com/package/@autobg/babel.macro)
- 🔧 [@autobg/postcss](./packages/postcss/README.zh-CN.md) [![npm downloads](https://img.shields.io/npm/dm/@autobg/postcss.svg?style=flat)](https://www.npmjs.com/package/@autobg/postcss)

## 📄 License

MIT
