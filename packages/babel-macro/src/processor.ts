import type { NodePath, PluginPass } from '@babel/core'
import type * as Babel from '@babel/core'
import type { AutobgMacroConfig } from './config'
import process from 'node:process'
import { createCSS, isHttp, resolveFilepath } from '@autobg/shared'
import { autoCssSize, overwrite } from './utils'

interface ProcessorParams {
  ref: NodePath
  config: Required<AutobgMacroConfig>
  state: PluginPass
  babel: typeof Babel
  aspect?: boolean
  argumentNodes: Babel.NodePath[]
}

export function processor(params: ProcessorParams) {
  const { ref, config, state, babel, aspect, argumentNodes } = params

  const root = state.file.opts.root ?? process.cwd()
  const id = state.file.opts.filename as string

  const csspath = argumentNodes[0].evaluate().value as string
  const filepath = resolveFilepath(csspath, id, root, config)

  const css = createCSS(
    isHttp(csspath) ? csspath : `\${${resolveInjectCode(csspath)}}`,
    filepath,
    {
      aspect,
      side: argumentNodes[1]?.evaluate().value,
      value: argumentNodes[2]?.evaluate().value,
      transformSize: size => autoCssSize(size, config),
    },
  )

  overwrite({ babel, ref: ref.parentPath!, css })
}

function resolveInjectCode(path: string) {
  const vite = `new URL('${path}', import.meta.url).href`
  const webpack = `require('${path}')?.default ?? require('${path}')`
  return `typeof require === 'undefined' ? ${vite} : ${webpack}`
}
