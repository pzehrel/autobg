import type { AutobgUnocssConfig } from './config'
import { resolveConfig } from '@autobg/shared'
import { definePreset } from '@unocss/core'
import { name } from '../package.json'
import { rules } from './rules'
import { transformer } from './transformer'

export type { AutobgUnocssConfig } from './config'

export const autobgPreset = definePreset<AutobgUnocssConfig, object>((config) => {
  const opts = resolveConfig(config)

  return {
    name,
    layer: 'base',
    rules: rules(opts),
    transformers: [transformer(opts)],
  }
})

export default autobgPreset
