import type { RequiredConfig } from '@autobg/shared'
import type { Rule } from '@unocss/core'
import type { Store } from './store'
import { createStyle, normalizePath, resolveCsspath, resolveFilepath } from '@autobg/shared'

// base: autobg-[url(./assets/vite.png)]
// width: autobg-[url(./assets/vite.png)]-w122
// height: autobg-[url(./assets/vite.png)]-h122
// percent: autobg-[url(./assets/vite.png)]-122%
export const ruleRE = /^autobg-\[(.+?)\](?:-([wh])-?(\d+(?:\.\d+)?)|-(\d+(?:\.\d+)?%?))?$/

export function rules(options: RequiredConfig, store: Store): Rule<object>[] {
  return [
    [ruleRE, ([, rawPath, wh, value, percentValue]) => {
      const path = normalizePath(rawPath)

      // The transformer will handle relative paths, so there is no need to pass the id.
      const filepath = resolveFilepath(path, '', store.root, options)
      const csspath = resolveCsspath(filepath, store.root, options)

      const style = createStyle(csspath, filepath, {
        sw: wh === 'w' ? value : undefined,
        sh: wh === 'h' ? value : undefined,
        ss: percentValue,
      })
      return style
    }],
  ]
}
