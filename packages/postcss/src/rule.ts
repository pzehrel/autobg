import type { RequiredConfig } from '@autobg/shared'
import type { AtRule } from 'postcss'
import { createStyle, normalizePath, resolveCsspath, resolveFilepath } from '@autobg/shared'

export function createAutobgAtRule(config: RequiredConfig, root: string) {
  return (rule: AtRule) => {
    const cssPath = normalizePath(rule.params.trim().replace(/^\(|\)$/, ''))

    if (!cssPath) {
      throw rule.error('need a resource file path parameter')
    }

    const parent = rule.parent
    if (!parent || !('selector' in parent) || typeof parent.selector !== 'string') {
      throw rule.error('must be used inside the selector')
    }

    const id = rule.source?.input.file || ''
    const filePath = resolveFilepath(cssPath, id, root, config)
    const path = resolveCsspath(filePath, root, config)

    const css = createStyle(path, filePath)
    Object.entries(css).forEach(([key, value]) => {
      parent.prepend({ prop: key, value })
    })

    // 移除 @autobg 规则
    rule.remove()
  }
}
