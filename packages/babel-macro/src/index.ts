import type { AutobgMacroConfig } from './config'
import process from 'node:process'
import { createStyle, isHttp, resolveConfig, resolveFilepath } from '@autobg/shared'
import { createMacro } from 'babel-plugin-macros'
import { defaultAutobgMacroConfig } from './config'
import { autoCssSize, overwrite } from './utils'

export { defineAutobgMacro } from './config'
export type { AutobgMacroConfig } from './config'

export const autobg = createMacro(({ references, state, babel, config }) => {
  references.default.forEach((reference) => {
    if (
      !reference.parentPath
      || reference.parentPath.node.type !== 'CallExpression'
      || reference !== reference.parentPath.get('callee')
    ) {
      return
    }

    let nodes = reference.parentPath.get('arguments')
    if (!Array.isArray(nodes)) {
      nodes = [nodes]
    }

    const opts = resolveConfig(defaultAutobgMacroConfig, config as AutobgMacroConfig)
    const csspath = nodes[0].evaluate().value as string

    const root = state.file.opts.root ?? process.cwd()
    const id = state.file.opts.filename as string

    const filepath = resolveFilepath(csspath, id, root, opts)
    const css = createStyle(
      isHttp(csspath) ? csspath : `\${${resolveInjectCode(csspath)}}`,
      filepath,
      {
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
