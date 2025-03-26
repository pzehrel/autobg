import type { HighlightAnnotation, SourceCodeTransformer } from '@unocss/core'
import type { RequiredAutobgPresetOptions } from './options'
import { existsSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import process from 'node:process'
import { name as PKG_NAME } from '../package.json'
import { absoluteToAliasPath, aliasToRelativePath, getAliasSymbol, isAlias, isHttp, isRelative, normalizePath } from './utils'

export function transformer(options: RequiredAutobgPresetOptions): SourceCodeTransformer {
  const root = process.cwd()
  const { alias, publicPath } = options

  return {
    name: `${PKG_NAME}:transform`,
    enforce: 'pre',
    idFilter: id => !id.includes('uno.css'),
    transform(mcode, id) {
      const code = mcode.toString()
      const matches = code.matchAll(/autobg-\[(.*)\]/g)
      const annotations: HighlightAnnotation[] = []

      for (const match of matches) {
        const [pattern, rawPath] = match
        if (!pattern)
          continue

        const cssPath = normalizePath(rawPath)
        if (!cssPath || isHttp(cssPath))
          continue

        let filePath = cssPath

        // 别名路径，转为绝对路径 eg. '@/xxx' -> '/src/xxx'
        if (isAlias(filePath, alias)) {
          filePath = aliasToRelativePath(filePath, alias)
          filePath = resolve(root, filePath)
        }

        // 相对路径，转为绝对路径 eg. './xxx' -> '/src/xxx'
        if (isRelative(filePath)) {
          filePath = resolve(dirname(id), filePath)
        }

        // 绝对路径，且不是以系统根目录开头 eg. '/xxx' -> '/public/xxx'
        if (isAbsolute(filePath) && !filePath.startsWith(root)) {
          const apath = filePath.replace(/^\//, '')
          const tmpPath = resolve(root, apath)
          if (!existsSync(tmpPath) && publicPath) {
            filePath = join(root, publicPath, filePath)
          }
        }

        // 优先使用别名路径，如果cssPath传入的时候不是别名路径，则使用相对项目根目录的绝对路径
        const rulePath = absoluteToAliasPath(filePath, root, alias, getAliasSymbol(cssPath, alias))

        const start = match.index
        const end = start + pattern.length
        mcode.overwrite(start, end, `autobg-[url(${rulePath})]`)

        annotations.push({
          offset: start,
          length: pattern.length,
          className: pattern,
        })
      }

      return {
        highlightAnnotations: annotations,
      }
    },
  }
}
