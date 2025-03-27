import type { AutobgMacroConfig } from './config'
import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'
import { isHttp, resolveConfig, resolveFilePath } from '@autobg/shared'
import { isCallExpression } from '@babel/types'
import { createMacro } from 'babel-plugin-macros'
import { imageSize } from 'image-size'
import { autoCssSize, overwrite } from './utils'

export { defineAutobgMacro } from './config'
export type { AutobgMacroConfig } from './config'

export const autobg = createMacro(({ references, state, babel, config }) => {
  references.default.forEach((reference) => {
    if (
      !reference.parentPath
      || !isCallExpression(reference.parentPath.node)
      || reference !== reference.parentPath.get('callee')
    ) {
      return
    }

    let nodes = reference.parentPath.get('arguments')
    if (!Array.isArray(nodes)) {
      nodes = [nodes]
    }

    const opts = resolveConfig(config as AutobgMacroConfig)
    const { alias, publicPath } = opts

    const cssPath = nodes[0].evaluate().value as string

    const css: Record<string, string> = {
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
    }

    // The http resource will not inject width and height
    if (isHttp(cssPath)) {
      css['background-image'] = `url(${cssPath})`
      overwrite({ babel, reference, css })
      return
    }

    // generate resource reference
    const viteInjectCode = `new URL('${cssPath}', import.meta.url).href`
    const webpackInjectCode = `require('${cssPath}')?.default ?? require('${cssPath}')`
    const injectCode = `typeof require === 'undefined' ? ${viteInjectCode} : ${webpackInjectCode}`
    css['background-image'] = `url("\${${injectCode}}")`

    /** File path for calling the resource */
    const id = state.file.opts.filename as string

    const root = state.file.opts.root ?? process.cwd()

    /** 资源文件路径 */
    const filePath = resolveFilePath({ cssPath, alias, id, root, publicPath })

    if (existsSync(filePath)) {
      const file = readFileSync(filePath)
      const { width, height } = imageSize(file)
      css.width = autoCssSize(width, opts)
      css.height = autoCssSize(height, opts)
    }

    overwrite({ babel, reference, css })
  })
}, { configName: 'autobg' })

export default autobg
