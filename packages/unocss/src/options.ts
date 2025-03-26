export type AliasConfig = Record<string, string>

export interface AutobgPresetOptions {
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

export type RequiredAutobgPresetOptions = Required<AutobgPresetOptions>
