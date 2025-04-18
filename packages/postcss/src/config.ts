import type { Config, RequiredConfig, TransformSize } from '@autobg/shared'

export interface AutobgPostcssConfig extends Config {
  root?: string

  transformSize?: TransformSize
}

export type RequiredAutobgPostcssConfig = RequiredConfig & Pick<AutobgPostcssConfig, 'root' | 'transformSize'>
