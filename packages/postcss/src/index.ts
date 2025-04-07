import type { Config } from '@autobg/shared'
import type { PluginCreator } from 'postcss'
import process from 'node:process'
import { resolveConfig } from '@autobg/shared'
import { createAutobgAtRule } from './rule'

export interface PostcssAutobgPluginConfig extends Config {
  root?: string
}

export const postcssAutobg: PluginCreator<PostcssAutobgPluginConfig> = (config) => {
  const root = (config?.root || process.cwd()).replace(/\\/g, '/')
  return {
    postcssPlugin: 'autobg',
    // make sure to run before other plugins
    prepare: () => ({
      Once: (node) => {
        // @autobg(<path>)
        // @autobg: url(<path>)
        node.walkAtRules(/^autobg:?/, (rule) => {
          createAutobgAtRule(resolveConfig(config), root)(rule)
        })
      },
    }),
  }
}

postcssAutobg.postcss = true

export default postcssAutobg
