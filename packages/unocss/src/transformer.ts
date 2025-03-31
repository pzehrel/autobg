import type { RequiredConfig } from '@autobg/shared'
import type { HighlightAnnotation, SourceCodeTransformer } from '@unocss/core'
import type { Store } from './store'
import { dirname, resolve } from 'node:path'
import { isAlias, isRelative } from '@autobg/shared'
import { name as PKG_NAME } from '../package.json'
import { normalizePath } from './utils'

export function transformer(options: RequiredConfig, store: Store): SourceCodeTransformer {
  return {
    name: `${PKG_NAME}:transform`,
    enforce: 'pre',
    idFilter: id => !id.includes('uno.css'),
    transform(code, id, ctx) {
      store.root = ctx.root

      const annotations: HighlightAnnotation[] = []

      for (const match of code.original.matchAll(/autobg-\[(.*)\]/g)) {
        const [pattern, rawPath] = match
        if (!pattern) {
          continue
        }

        let cssPath = normalizePath(rawPath)
        if (!cssPath) {
          continue
        }

        // Vite does not parse relative paths, so they need to be converted to absolute paths based on the project root directory.
        if (!isAlias(cssPath, options.alias) && isRelative(cssPath)) {
          const tmp = resolve(dirname(id), cssPath)
            .replace(/\\/g, '/') // make sure the path is posix path
          cssPath = tmp.replace(store.root, '')
        }

        const start = match.index
        const end = start + pattern.length
        code.overwrite(start, end, `autobg-[url(${cssPath})]`)

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
