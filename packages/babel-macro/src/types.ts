import type { Percentage } from '@autobg/shared'

export interface AutobgFn {
  /**
   * @param url - The path to the image file.
   * @returns The CSS style string.
   */
  (url: string): string
  /**
   * @param url - The path to the image file.
   * @param wh - The width or height parameter to scale the image. The other dimension will be calculated automatically to maintain aspect ratio.
   * @param value - The value to scale the image.
   * @returns The CSS style string.
   *
   * @example
   * ```ts
   * @autobg('foo.png', 'w', 123)
   * @autobg('foo.png', 'width', 123)
   * @autobg('foo.png', 'h', 123)
   * @autobg('foo.png', 'height', 123)
   * ```
   */
  (url: string, wh: 'w' | 'h' | 'width' | 'height', value: number): string
  /**
   * @param url - The path to the image file.
   * @param ss - The scale parameter for uniform scaling.
   * @param value - The scaling factor or percentage.
   * @returns The CSS style string.
   *
   * @example
   * ```ts
   * @autobg('foo.png', 's', 0.75)
   * @autobg('foo.png', 'scale', 0.75)
   * @autobg('foo.png', 's', '75%')
   * @autobg('foo.png', 'scale', '75%')
   * ```
   */
  (url: string, ss: 's' | 'scale', value: number | Percentage): string
  /**
   * Equivalent to `@autobg('@/assets/react.png', 'scale', '75%')` or `@autobg('@/assets/react.png', 'scale', 0.75)`
   *
   * @param url - The path to the image file.
   * @param value - The value to scale the image.
   * @returns The CSS style string.
   *
   * @example
   * ```ts
   * @autobg('foo.png', 0.75)
   * @autobg('foo.png', '75%')
   * ```
   */
  (url: string, value: number): string
}
