import type { AutobgMacroConfig } from './config'
import type { AutobgFn } from './types'
import { resolveConfig } from '@autobg/shared'
import { createMacro } from 'babel-plugin-macros'
import { defaultAutobgMacroConfig } from './config'
import { processor } from './processor'
import { toArray } from './utils'

export { defineAutobgMacro } from './config'
export type { AutobgMacroConfig } from './config'

interface Autobg extends AutobgFn {
  /**
   * Use the `aspect-ratio` property to control the aspect ratio of an element
   */
  aspect: AutobgFn
}

const autobg = createMacro((params) => {
  const { references, state, babel } = params

  const config = resolveConfig(defaultAutobgMacroConfig, params.config as AutobgMacroConfig)

  references.default.forEach((ref) => {
    // autobg.aspect()
    if (
      ref.parentPath?.node.type === 'MemberExpression'
      // && ref.parentPath.node.object.type === 'Identifier'
      // && ref.parentPath.node.object.name === 'autobg'
      && ref.parentPath.node.property.type === 'Identifier'
      && ref.parentPath.node.property.name === 'aspect'
      && ref.parentPath.parentPath?.node.type === 'CallExpression'
      && ref.parentPath === ref.parentPath.parentPath.get('callee')
    ) {
      const argumentNodes = toArray(ref.parentPath.parentPath.get('arguments'))
      processor({ aspect: true, ref: ref.parentPath.parentPath, config, state, babel, argumentNodes })
    }

    // autobg()
    if (ref.parentPath?.node.type === 'CallExpression' && ref === ref.parentPath.get('callee')) {
      const argumentNodes = toArray(ref.parentPath.get('arguments'))
      processor({ aspect: false, ref, config, state, babel, argumentNodes })
    }
  })
}, { configName: 'autobg' }) as unknown as Autobg

export default autobg
