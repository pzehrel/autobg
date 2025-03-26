import type { AliasConfig, AutobgPresetOptions, RequiredAutobgPresetOptions } from './options'
import { definePreset } from '@unocss/core'
import { name } from '../package.json'
import { rules } from './rules'
import { transformer } from './transformer'

const DEFAULT_ALIAS: AliasConfig = {
  '@': 'src',
  '~@': 'src',
}

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
