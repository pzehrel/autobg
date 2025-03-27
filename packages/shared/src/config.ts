export type AliasConfig = Record<string, string>

export const DEFAULT_ALIAS: AliasConfig = {
  '@/': 'src',
  '~@/': 'src',
  '~/': 'src',
}

export interface Config {
  /**
   * alias path config
   *
   * @default { '@': 'src', '~@': 'src' }
   */
  alias?: AliasConfig

  /**
   * public path, only vite will use.
   *
   * resolve `/xxx` file to `public` directory.
   *
   * @default 'public'
   */
  publicPath?: false | string
}
export type RequiredConfig = Required<Config>

export const DEFAILT_CONFIG: Config = {
  alias: DEFAULT_ALIAS,
  publicPath: 'public',
}

export function resolveConfig<T extends Config>(...configs: (Partial<T> | undefined)[]): T & RequiredConfig {
  return Object.assign({}, DEFAILT_CONFIG, ...configs)
}
