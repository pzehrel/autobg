import type { HighlightAnnotation, SourceCodeTransformer } from '@unocss/core'
import type MagicString from 'magic-string'
import type { RequiredAutobgUnocssConfig } from './config'
import type { Store } from './store'
import { dirname, join } from 'node:path'
import { isAlias, isRelative, normalizePath } from '@autobg/shared'
import { name as PKG_NAME } from '../package.json'

const cssUrlRE = /url\(['"]?(.+?)(['"])?\)/g

/** autobg */
const autobgRE = /autobg-\[(.+?)\](?:-((?:[whs]|width|height|scale)-?)?(\d+(?:\.\d+)?%?))?/g

/** autobg-aspect */
const autobgAspectRE = /autobg-(?:asp|aspect)-\[(.+?)\](?:-(([whs]|width|height|scale))?(-?\d+(?:\.\d+)?%?)?)?/g

export function transformer(config: RequiredAutobgUnocssConfig, store: Store): SourceCodeTransformer {
  function handle(match: RegExpExecArray, code: MagicString, id: string, annotations: HighlightAnnotation[]) {
    const [pattern, rawpath] = match

    if (!pattern) {
      return
    }

    let csspath = normalizePath(rawpath)
    if (!csspath) {
      return
    }

    // Vite does not parse relative paths, so they need to be converted to absolute paths based on the project root directory.
    if (store.root && !isAlias(csspath, config.alias) && isRelative(csspath)) {
      const tmp = join(dirname(id), csspath)
        .replace(/\\/g, '/') // make sure the path is posix path
      csspath = tmp.replace(store.root, '')
    }

    const className = pattern.replace(cssUrlRE, (_, __, quote = '') => `url(${quote}${csspath}${quote})`)

    const length = pattern.length
    const start = match.index
    const end = start + length
    code.overwrite(start, end, className)

    annotations.push({
      offset: start,
      length,
      className: className.trim(),
    })
  }

  return {
    name: `${PKG_NAME}:transformer`,
    enforce: 'pre',
    idFilter: id => !id.includes('uno.css'),
    transform(code, id, ctx) {
      store.updateRoot({ configRoot: config.root, ctxRoot: ctx.root })

      id = id.replace(/\\/g, '/')

      const annotations: HighlightAnnotation[] = []

      for (const match of code.original.matchAll(autobgRE)) {
        handle(match, code, id, annotations)
      }

      for (const match of code.original.matchAll(autobgAspectRE)) {
        handle(match, code, id, annotations)
      }

      return { highlightAnnotations: annotations }
    },
  }
}
