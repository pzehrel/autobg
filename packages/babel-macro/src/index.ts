import type { Percentage, StyleOptions } from '@autobg/shared'
import type { AutobgMacroConfig } from './config'
import process from 'node:process'
import { createStyle, isHttp, resolveConfig, resolveFilepath } from '@autobg/shared'
import { createMacro } from 'babel-plugin-macros'
import { defaultAutobgMacroConfig } from './config'
import { autoCssSize, overwrite, toArray } from './utils'

export { defineAutobgMacro } from './config'
export type { AutobgMacroConfig } from './config'

interface Autobg {
  /**
   * @param url - The path to the image file.
   * @returns The CSS style string.
   */
  (url: string): string
  /**
   * @param url - The path to the image file.
   * @param wh - The width or height parameter to scale the image. The other dimension will be calculated automatically to maintain aspect ratio.
   * @param value - The value to scale the image.
   * @returns The CSS style string.
   *
   * @example
   * ```ts
   * @autobg('foo.png', 'w', 123)
   * @autobg('foo.png', 'width', 123)
   * @autobg('foo.png', 'h', 123)
   * @autobg('foo.png', 'height', 123)
   * ```
   */
  (url: string, wh: 'w' | 'h' | 'width' | 'height', value: number): string
  /**
   * @param url - The path to the image file.
   * @param ss - The scale parameter for uniform scaling.
   * @param value - The scaling factor or percentage.
   * @returns The CSS style string.
   *
   * @example
   * ```ts
   * @autobg('foo.png', 's', 0.75)
   * @autobg('foo.png', 'scale', 0.75)
   * @autobg('foo.png', 's', '75%')
   * @autobg('foo.png', 'scale', '75%')
   * ```
   */
  (url: string, ss: 's' | 'scale', value: number | Percentage): string
  /**
   * Equivalent to `@autobg('@/assets/react.png', 'scale', '75%')` or `@autobg('@/assets/react.png', 'scale', 0.75)`
   *
   * @param url - The path to the image file.
   * @param value - The value to scale the image.
   * @returns The CSS style string.
   *
   * @example
   * ```ts
   * @autobg('foo.png', 0.75)
   * @autobg('foo.png', '75%')
   * ```
   */
  (url: string, value: number): string
}

const autobg: Autobg = createMacro(({ references, state, babel, config }) => {
  references.default.forEach((reference) => {
    if (
      !reference.parentPath
      || reference.parentPath.node.type !== 'CallExpression'
      || reference !== reference.parentPath.get('callee')
    ) {
      return
    }

    const nodes = toArray(reference.parentPath.get('arguments'))

    const opts = resolveConfig(defaultAutobgMacroConfig, config as AutobgMacroConfig)
    const root = state.file.opts.root ?? process.cwd()
    const id = state.file.opts.filename as string

    const csspath = nodes[0].evaluate().value as string
    const filepath = resolveFilepath(csspath, id, root, opts)

    const css = createStyle(
      isHttp(csspath) ? csspath : `\${${resolveInjectCode(csspath)}}`,
      filepath,
      {
        ...parseScale(
          nodes[1]?.evaluate().value,
          nodes[2]?.evaluate().value,
        ),
        transformSize: size => ({
          width: autoCssSize(size.width, opts),
          height: autoCssSize(size.height, opts),
        }),
      },
    )

    overwrite({ babel, reference, css })
  })
}, { configName: 'autobg' })

export default autobg

function resolveInjectCode(path: string) {
  const vite = `new URL('${path}', import.meta.url).href`
  const webpack = `require('${path}')?.default ?? require('${path}')`
  return `typeof require === 'undefined' ? ${vite} : ${webpack}`
}

function parseScale(whs: string | undefined, value: string | number | undefined): Pick<StyleOptions, 'sw' | 'sh' | 'ss'> {
  // @autobg('@/assets/react.png', '75%')
  // @autobg('@/assets/react.png', 0.75)
  if (whs && value === undefined && /^\d+(?:\.\d+)?%?$/.test(whs)) {
    value = whs
    whs = 's'
  }

  value = value ?? ''

  return {
    sw: whs === 'w' || whs === 'width' ? value : undefined,
    sh: whs === 'h' || whs === 'height' ? value : undefined,
    ss: whs === 's' || whs === 'scale' ? value : undefined,
  }
}
