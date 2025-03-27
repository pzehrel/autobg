import type { Config } from '@autobg/shared'
import { resolveConfig } from '@autobg/shared'

export interface AutobgMacroConfig extends Config {

  /**
   * generate css value unit
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

export const defaultAutobgMacroConfig = resolveConfig<RequiredAutobgMacroConfig>({
  unit: 'px',
  designWidth: 750,
  rootValue: 100,
  unitPrecision: 5,
})

export const defineAutobgMacro = (config: AutobgMacroConfig) => config
