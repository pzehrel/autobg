import type { RequiredConfig } from '@autobg/shared'
import type { HighlightAnnotation, SourceCodeTransformer } from '@unocss/core'
import process from 'node:process'
import { getAliasSymbol, isHttp, resolveFilePath } from '@autobg/shared'
import { name as PKG_NAME } from '../package.json'
import { absoluteToAliasPath, normalizePath } from './utils'

export function transformer(options: RequiredConfig): SourceCodeTransformer {
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
        if (!pattern) {
          continue
        }

        const cssPath = normalizePath(rawPath)
        if (!cssPath) {
          continue
        }

        let resultPath = ''

        if (isHttp(cssPath)) {
          resultPath = cssPath
        }
        else {
          const filePath = resolveFilePath({ cssPath, alias, id, root, publicPath })

          // Prefer to use alias paths; if the cssPath is not an alias path when passed in,
          // then use the absolute path relative to the project root directory.
          const rulePath = absoluteToAliasPath(filePath, root, alias, getAliasSymbol(cssPath, alias))

          resultPath = rulePath
        }

        const start = match.index
        const end = start + pattern.length
        mcode.overwrite(start, end, `autobg-[url(${resultPath})]`)

        annotations.push({
          offset: start,
          length: pattern.length,
          className: pattern,
        })
      }

      return { highlightAnnotations: annotations }
    },
  }
}
