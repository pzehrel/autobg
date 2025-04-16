import type { CreateCssOptions, RequiredConfig } from '@autobg/shared'
import type { AtRule } from 'postcss'
import { createCSS, normalizePath, resolveCsspath, resolveFilepath } from '@autobg/shared'

const pathRE = /url\(["']?(.+?)["']?\)/
const scaleRE = /([whs]|width|height|scale)\((\d+(?:\.\d+)?%?)\)/
const aspectRE = /([whs]|width|height|scale)\((\d+(?:\.\d+)?%?)?\)/
const scaleWrongRE = /([whs]|width|height|scale)\(\d+(?:\.\d+)?([^\d%]+)\)/

export function createProcessor(config: RequiredConfig, root: string, aspect?: boolean) {
  return (rule: AtRule) => {
    const parent = rule.parent
    if (!parent || !('selector' in parent) || typeof parent.selector !== 'string') {
      throw rule.error('must be used inside the selector')
    }

    const params = rule.params.trim()
    if (!params) {
      throw rule.error('Parameters cannot be empty')
    }

    const pathMatch = params.match(pathRE)
    if (!pathMatch) {
      throw rule.error('Missing url(<path>) parameter')
    }
    const csspath = normalizePath(pathMatch[1])
    if (!csspath) {
      throw rule.error('Resource file path error')
    }

    const scaleWrongMatch = params.match(scaleWrongRE)
    if (scaleWrongMatch) {
      const [, scale, value, unit] = scaleWrongMatch
      throw rule.error(`"${scale}(${value}${unit})" does not support unit "${unit}", the correct format is "${scale}(${value})" or "${scale}(${value}%)"`)
    }

    const cssOptions: CreateCssOptions = { aspect }
    const scaleMatch = params.match(aspect ? aspectRE : scaleRE)
    if (scaleMatch) {
      const [, scale, value] = scaleMatch
      cssOptions.side = scale
      cssOptions.value = value
    }

    const id = rule.source?.input.file || ''
    const filepath = resolveFilepath(csspath, id, root, config)
    const path = resolveCsspath(filepath, root, config)

    const css = createCSS(path, filepath, cssOptions)
    Object.entries(css).forEach(([key, value]) => {
      parent.prepend({ prop: key, value })
    })

    rule.remove()
  }
}
