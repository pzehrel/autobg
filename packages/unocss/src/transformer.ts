import type { HighlightAnnotation, SourceCodeTransformer } from '@unocss/core'
import type { RequiredAutobgUnocssConfig } from './config'
import type { Store } from './store'
import { isRelative, normalizePath } from '@autobg/shared'
import { dirname, join, normalize } from 'pathe'
import { name as PKG_NAME } from '../package.json'
import { createRuleRegExps } from './rules'

const URL_RE = /url\(['"]?(.+?)(['"])?\)/

const exactRegExps = createRuleRegExps().map(([regexp]) => regexp)

export function transformer(config: RequiredAutobgUnocssConfig, store: Store): SourceCodeTransformer {
  return {
    name: `${PKG_NAME}:transformer`,
    enforce: 'pre',
    transform(code, id, ctx) {
      store.updateRoot({ configRoot: config.root, ctxRoot: ctx.root })
      id = id.replace(/\\/g, '/')

      const annotations: HighlightAnnotation[] = []

      const fuzzyMatches = code.original.matchAll(/autobg(?:-asp|-aspect)?-\[url\(.+?\)\][a-zA-Z0-9-%]*/g)
      for (const { index, 0: original } of fuzzyMatches) {
        const exactMatch = find(exactRegExps, regexp => original.match(regexp))
        if (!exactMatch) {
          return
        }
        const { 0: pattern, 1: rawpath } = exactMatch
        const csspath = normalizePath(rawpath)

        let path = csspath
        let className = pattern

        // Vite does not parse relative paths, so they need to be converted to absolute paths based on the project root directory.
        if (store.root && isRelative(csspath)) {
          path = join(dirname(id), csspath).replace(normalize(store.root), '')
          className = pattern.replace(URL_RE, (_, __, quote = '') => `url(${quote}${path}${quote})`)
        }

        const length = pattern.length
        const start = index
        const end = start + length

        code.overwrite(start, end, className)
        annotations.push({ offset: start, length, className })
      }

      return { highlightAnnotations: annotations }
    },
  }
}

function find<Item, T>(array: Item[], callback: (item: Item) => T | undefined): T | undefined {
  for (const item of array) {
    const result = callback(item)
    if (result) {
      return result
    }
  }

  return undefined
}
