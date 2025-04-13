import type { RequiredConfig } from '@autobg/shared'
import type { AtRule } from 'postcss'
import { createStyle, normalizePath, resolveCsspath, resolveFilepath } from '@autobg/shared'

const ruleRE = /^url\(["']?(.+?)["']?\)(?:\s+([wh]|width|height)\((.+?)\)|\s+(s|scale)\((.+?%?)\))?$/

export function createAutobgAtRule(config: RequiredConfig, root: string) {
  return (rule: AtRule) => {
    const params = rule.params.trim()

    if (!params) {
      throw rule.error('need a resource file path parameter')
    }

    const match = params.match(ruleRE)
    if (!match) {
      throw rule.error('invalid params')
    }

    // width and height syntax check
    const whMatch = params.match(/([wh]|width|height)\((\d+(?:\.\d+)?)(\D+)\)/)
    if (whMatch) {
      const [, wh, value, unit] = whMatch
      throw rule.error(`Not supported: "${wh}(${value}${unit})" is invalid, correct format is "${wh}(${value})"`)
    }

    const [, rawpath, wh, whValue, s, sValue] = match

    const cssPath = normalizePath(rawpath)
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

    const css = createStyle(path, filePath, {
      sw: wh === 'w' || wh === 'width' ? whValue : undefined,
      sh: wh === 'h' || wh === 'height' ? whValue : undefined,
      ss: s ? sValue : undefined,
    })
    Object.entries(css).forEach(([key, value]) => {
      parent.prepend({ prop: key, value })
    })

    // remove @autobg rule
    rule.remove()
  }
}
