import type * as Babel from '@babel/core'
import type { VariableDeclaration } from '@babel/types'
import type { RequiredAutobgMacroConfig } from './config'

/**
 * auto css size, px to rem or vw
 * @param px px value
 * @param config config
 */
export function autoCssSize(px: number, config: RequiredAutobgMacroConfig) {
  const { unit, unitPrecision } = config
  if (unit === 'rem') {
    px = Number((px / config.rootValue).toFixed(unitPrecision))
    return `${px}rem`
  }
  if (unit === 'vw') {
    px = Number(((Math.round(px) / config.designWidth) * 100).toFixed(unitPrecision))
    return `${px}vw`
  }
  return `${px}px`
}

interface OverviewOptions {
  css: Record<string, string>
  babel: typeof Babel
  reference: Babel.NodePath
}

/**
 * modify code
 */
export function overwrite({ css, babel, reference }: OverviewOptions) {
  const code = Object.entries(css).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) {
      return acc
    }
    value = value.endsWith(';') ? value : `${value};`
    return acc += `${key}: ${value}`
  }, '')

  const body = babel.parse(`var str = \`${code}\``)?.program.body[0] as VariableDeclaration | undefined
  const ast = body?.declarations[0].init
  if (ast) {
    reference.parentPath?.replaceWith(ast)
  }
}
