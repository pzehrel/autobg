import type { RequiredConfig } from '@autobg/shared'
import type { Rule } from '@unocss/core'
import type { Store } from './store'
import process from 'node:process'
import { createStyle, normalizePath, resolveCsspath, resolveFilepath } from '@autobg/shared'

export function rules(options: RequiredConfig, store: Store): Rule<object>[] {
  return [
    [/^autobg-(.+)$/, ([, rawPath]) => {
      // the vscode extension does not pass the root to the transformer, so we need to use the process.cwd()
      const root = store.root || process.cwd()

      const path = normalizePath(rawPath)

      // The transformer will handle relative paths, so there is no need to pass the id.
      const filepath = resolveFilepath(path, '', root, options)
      const csspath = resolveCsspath(filepath, root, options)
      // console.log(111, path, csspath, filepath)

      const style = createStyle(csspath, filepath)
      return style
    }],
  ]
}
