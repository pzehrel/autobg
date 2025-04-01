import type { RequiredConfig } from '@autobg/shared'
import type { AutobgMacroConfig } from './config'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import process from 'node:process'
import { isAlias, isHttp, isRelative, resolveConfig } from '@autobg/shared'
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

    const cssPath = nodes[0].evaluate().value as string

    const css: Record<string, string> = {
      'background-image': `url("${isHttp(cssPath) ? cssPath : `\${${resolveInjectCode(cssPath)}}`}")`,
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
    }

    if (!isHttp(cssPath)) {
      const root = state.file.opts.root ?? process.cwd()

      /** File path for calling the resource */
      const id = state.file.opts.filename as string

      /** 资源文件路径 */
      const filePath = resolveFilepath(cssPath, root, id, opts)

      if (existsSync(filePath)) {
        const file = readFileSync(filePath)
        const { width, height } = imageSize(file)
        css.width = autoCssSize(width, opts)
        css.height = autoCssSize(height, opts)
      }
    }

    overwrite({ babel, reference, css })
  })
}, { configName: 'autobg' })

export default autobg

function resolveInjectCode(path: string) {
  const vite = `new URL('${path}', import.meta.url).href`
  const webpack = `require('${path}')?.default ?? require('${path}')`
  return `typeof require === 'undefined' ? ${vite} : ${webpack}`
}

function resolveFilepath(path: string, root: string, id: string, config: RequiredConfig) {
  const { alias, publicPath } = config

  path = path.replace(/\\/g, '/')
  root = root.replace(/\\/g, '/')
  id = id.replace(/\\/g, '/')

  // '@/xxx' -> '/src/xxx'
  if (isAlias(path, alias)) {
    const [symbol, value = ''] = Object.entries(alias).find(([k]) => path.startsWith(k)) || []
    if (symbol) {
      path = path.replace(new RegExp(`^${symbol}`), '')
      path = join(root, value, path)
      return path
    }
  }

  // './xxx' -> '/src/xxx'
  if (isRelative(path)) {
    path = resolve(dirname(id), path)
    return path
  }

  // '/xxx' -> '/public/xxx'
  if (isAbsolute(path) && !path.startsWith(root)) {
    const fillpath = join(root, path)

    // project root file exists
    if (existsSync(fillpath)) {
      return path
    }

    // public file exists
    if (publicPath) {
      const tmp = join(root, publicPath, path)
      if (existsSync(tmp)) {
        return tmp
      }
    }
  }

  // http
  return path
}
