import type { AutobgPresetOptions, RequiredAutobgPresetOptions } from './options'
import { DEFAULT_ALIAS } from '@autobg/shared'
import { definePreset } from '@unocss/core'
import { name } from '../package.json'
import { rules } from './rules'
import { transformer } from './transformer'

export const autobgPreset = definePreset<AutobgPresetOptions, object>((options) => {
  const opts: RequiredAutobgPresetOptions = Object.assign({
    alias: DEFAULT_ALIAS,
    publicPath: 'public',
  }, options)

  return {
    name,
    layer: 'base',
    rules: rules(opts),
    transformers: [transformer(opts)],
  }
})

export default autobgPreset
