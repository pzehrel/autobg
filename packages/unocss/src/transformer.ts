import type { HighlightAnnotation, SourceCodeTransformer } from '@unocss/core'
import type { RequiredAutobgUnocssConfig } from './config'
import type { Store } from './store'
import { dirname, join } from 'node:path'
import { isAlias, isRelative, normalizePath } from '@autobg/shared'
import { name as PKG_NAME } from '../package.json'

export function transformer(config: RequiredAutobgUnocssConfig, store: Store): SourceCodeTransformer {
  return {
    name: `${PKG_NAME}:transformer`,
    enforce: 'pre',
    idFilter: id => !id.includes('uno.css'),
    transform(code, id, ctx) {
      store.updateRoot({ configRoot: config.root, ctxRoot: ctx.root })

      id = id.replace(/\\/g, '/')

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
        if (store.root && !isAlias(cssPath, config.alias) && isRelative(cssPath)) {
          const tmp = join(dirname(id), cssPath)
            .replace(/\\/g, '/') // make sure the path is posix path
          cssPath = tmp.replace(store.root, '')
        }

        const start = match.index
        const end = start + pattern.length
        const className = `autobg-[url(${cssPath})]`
        code.overwrite(start, end, className)

        annotations.push({
          offset: start,
          length: pattern.length,
          className,
        })
      }

      return { highlightAnnotations: annotations }
    },
  }
}
