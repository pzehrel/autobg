import type { RequiredConfig } from '@autobg/shared'
import type { Rule } from '@unocss/core'
import type { Store } from './store'
import { createStyle, normalizePath, resolveCsspath, resolveFilepath } from '@autobg/shared'

export function rules(options: RequiredConfig, store: Store): Rule<object>[] {
  return [
    [/^autobg-(.+)$/, ([, rawPath]) => {
      const path = normalizePath(rawPath)

      // The transformer will handle relative paths, so there is no need to pass the id.
      const filepath = resolveFilepath(path, '', store.root, options)
      const csspath = resolveCsspath(filepath, store.root, options)

      const style = createStyle(csspath, filepath)
      return style
    }],
  ]
}
