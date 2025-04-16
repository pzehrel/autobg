import type { Config } from '@autobg/shared'
import type { PluginCreator } from 'postcss'
import process from 'node:process'
import { resolveConfig } from '@autobg/shared'
import { createProcessor } from './processor'

export interface PostcssAutobgPluginConfig extends Config {
  root?: string
}

export const postcssAutobg: PluginCreator<PostcssAutobgPluginConfig> = (config) => {
  const root = (config?.root || process.cwd()).replace(/\\/g, '/')

  const cfg = resolveConfig(config)

  return {
    postcssPlugin: 'autobg',
    // make sure to run before other plugins
    prepare: () => ({
      Once: (node) => {
        // @autobg url(<path>)
        node.walkAtRules('autobg', createProcessor(cfg, root))

        // @autobg-aspect url(<path>)
        node.walkAtRules('autobg-aspect', createProcessor(cfg, root, true))
      },
    }),
  }
}

postcssAutobg.postcss = true

export default postcssAutobg
