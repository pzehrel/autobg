import type { Config } from '@autobg/shared'
import type { PluginCreator } from 'postcss'
import process from 'node:process'
import { resolveConfig } from '@autobg/shared'
import { createAutobgAtRule } from './rule'

export interface PostcssAutobgPluginConfig extends Config {
}

export const postcssAutobg: PluginCreator<PostcssAutobgPluginConfig> = (config) => {
  return {
    postcssPlugin: 'autobg',
    // make sure to run before other plugins
    prepare: () => ({
      Once: (root) => {
        // @autobg(<path>)
        // @autobg: url(<path>)
        root.walkAtRules(/^autobg:?/, (rule) => {
          createAutobgAtRule(resolveConfig(config), process.cwd())(rule)
        })
      },
    }),
  }
}

postcssAutobg.postcss = true

export default postcssAutobg
