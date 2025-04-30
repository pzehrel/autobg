import type { AutobgUnocssConfig } from './config'
import { resolveConfig } from '@autobg/shared'
import { definePreset } from '@unocss/core'
import { name } from '../package.json'
import { createRules } from './rules'
import { createStore } from './store'
import { transformer } from './transformer'

export type { AutobgUnocssConfig } from './config'

export const presetAutobg = definePreset<AutobgUnocssConfig, object>((config) => {
  const opts = resolveConfig(config)

  const store = createStore()
  store.updateRoot({ configRoot: config?.root })

  return {
    name,
    layer: 'base',
    transformers: [transformer(opts, store)],
    rules: createRules(opts, store),
  }
})
