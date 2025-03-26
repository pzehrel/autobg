import type { AliasConfig } from '@autobg/shared'

export interface AutobgMacroConfig {
  /**
   * alias config
   */
  alias?: AliasConfig

  /**
   * public path
   */
  publicPath?: string

  /**
   * css unit
   * @default 'px'
   */
  unit?: 'px' | 'rem' | 'vw'

  /**
   * design width, only used when unit is 'vw'
   * @default 750
   */
  designWidth?: number

  /**
   * root element font size, only used when unit is 'rem'
   * @default 100
   */
  rootValue?: number

  /**
   * The number of decimal places to retain during unit conversion
   * @default 5
   */
  unitPrecision?: number
}

export type RequiredAutobgMacroConfig = Required<AutobgMacroConfig>

export const defaultAutobgMacroConfig: RequiredAutobgMacroConfig = {
  alias: {
    '~@/': 'src',
    '@/': 'src',
    '~/': 'src',
  },
  publicPath: 'public',

  unit: 'px',
  designWidth: 750,
  rootValue: 100,
  unitPrecision: 5,
}

export function resolveConfig(...configs: AutobgMacroConfig[]): RequiredAutobgMacroConfig {
  const config = Object.assign({}, defaultAutobgMacroConfig, ...configs)

  if (config.baseUrl) {
    config.basePath = config.baseUrl
  }

  return config
}

export const defineAutobgMacro = (config: AutobgMacroConfig) => config
