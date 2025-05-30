import type { Config, RequiredConfig } from '@autobg/shared'

export interface AutobgUnocssConfig extends Config {
  /**
   * The root directory of the project.
   *
   * The VSCode unocss extension will call the preset but doesn't pass in the project root directory path,
   * nor can you get the correct project root directory through `process.cwd()`.
   *
   * If not provided, the code hover tooltips from the VSCode UnoCSS extension will display incorrect class names,
   * but it won't affect the actual class name generation.
   *
   * @example
   * ```ts
   * presetAutobg({
   *   // Use absolute path instead of `process.cwd()`
   *   root: import.meta.dirname,
   * })
   * ```
   */
  root?: string

  /**
   * Transforms width and height values, allowing you to add style units.
   *
   * May be deprecated in the future.
   *
   * @param size - The original width and height value.
   * @returns The transformed width and height value.
   */
  transformSize?: (size: number) => string | number
}

export type RequiredAutobgUnocssConfig = RequiredConfig & Pick<AutobgUnocssConfig, 'root' | 'transformSize'>
