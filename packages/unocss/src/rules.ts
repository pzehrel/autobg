import type { RequiredConfig } from '@autobg/shared'
import type { Rule } from '@unocss/core'
import type { Store } from './store'
import { createCSS, normalizePath, resolveCsspath, resolveFilepath } from '@autobg/shared'

export function rules(options: RequiredConfig, store: Store): Rule<object>[] {
  function handle(rawpath: string, side: string = 's', value?: string | number, aspect?: boolean) {
    const path = normalizePath(rawpath)
    const filepath = resolveFilepath(path, '', store.root, options)
    const csspath = resolveCsspath(filepath, store.root, options)
    return createCSS(csspath, filepath, { side, value, aspect })
  }

  return [
    [/^autobg-\[(.+?)\](?:-((?:[whs]|width|height|scale)-?)?(\d+(?:\.\d+)?%?))?$/, (match) => {
      const [, rawpath, side, value] = match
      return handle(rawpath, side, value)
    }],

    [/^autobg-(?:asp|aspect)-\[(.+?)\](?:-([whs]|width|height|scale)?(-?\d+(?:\.\d+)?%?)?)?$/, (match) => {
      const [, rawpath, side, value] = match
      return handle(rawpath, side, value, true)
    }],
  ]
}
