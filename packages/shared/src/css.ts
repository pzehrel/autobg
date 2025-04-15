import type { NumberString, Percentage, Size, UnitSize } from './type'
import { imageSize } from './image-size'
import { isHttp } from './utils'

type ExactSide = 'w' | 'h' | 's'
export type Side = ExactSide | 'width' | 'height' | 'scale'

interface CreateCssOptions {
  /**
   * Determines which dimension to use for calculating the scaling ratio
   *
   * - `w`/`width`: Calculate scaling ratio based on width, automatically compute height
   * - `h`/`height`: Calculate scaling ratio based on height, automatically compute width
   * - `s`/`scale`: Direct scaling ratio
   */
  side?: Side | (string & {})

  /**
   * Use the `aspect-ratio` property to maintain aspect ratio. When using this option,
   * only one dimension's style property can be preserved, otherwise `aspect-ratio` won't take effect.
   *
   * The preserved dimension depends on the `side` value:
   * - When `side` is `w`/`s`, width is preserved
   * - When `side` is `h`, height is preserved
   */
  aspect?: boolean

  /**
   * Value used to calculate the proportional scaling ratio
   *
   * - Number: When `side` is `s`, represents the scaling ratio (e.g., 0.7);
   *   When `side` is `w`/`h`, represents the scaled width/height (e.g., 100)
   * - Percentage string: When `side` is `w`/`h`, represents width/height (e.g., '70%')
   */
  value?: NumberString | Percentage

  /** Function to transform size units */
  transformSize?: (size: Size) => UnitSize
}

/**
 * Creates CSS styles for background images with proper scaling
 * @param csspath The path referenced in CSS (this path will be processed by the compiler)
 * @param filepath The actual path of the image
 * @param options Configuration options
 * @returns CSS style object
 */
export function createCSS(csspath: string, filepath?: string, options?: CreateCssOptions) {
  const size = filepath && !isHttp(csspath) ? imageSize(filepath) : null

  const css: Record<string, string> = {
    'background-image': `url('${csspath}')`,
    'background-repeat': 'no-repeat',
    'background-size': 'contain',
    'background-position': 'center',
  }

  if (!size) {
    if (options?.aspect) {
      css['aspect-ratio'] = '1/1'
    }
    return css
  }

  const side = fmtSide(options?.side)
  const value = options?.value ?? '100%'
  const rate = size ? parseRate(size, side, value) : 1

  const { transformSize = defaultTransformSize } = options ?? {}

  const scaledSize = { width: size.width * rate, height: size.height * rate }
  const { width, height } = transformSize(scaledSize)

  // When not using `aspect-ratio`, we need to provide both width and height to maintain aspect ratio
  if (!options?.aspect) {
    Object.assign(css, { width, height })
  }
  // When using `aspect-ratio`, we only need one dimension, otherwise `aspect-ratio` won't work
  else {
    css['aspect-ratio'] = `${size.width}/${size.height}`
    if (side === 'h') {
      css.height = height
    }
    else {
      css.width = width
    }
  }
  return css
}

function fmtSide(side: Side | (string & {}) = 's'): ExactSide {
  if (side === 'h' || side === 'height') {
    return 'h'
  }
  if (side === 'w' || side === 'width') {
    return 'w'
  }
  return 's'
}

/**
 * Calculate scaling ratio
 *
 * - When `side` is `s`: Represents overall scaling ratio
 * - When `side` is `w`: Represents width scaling ratio, height will be calculated proportionally
 * - When `side` is `h`: Represents height scaling ratio, width will be calculated proportionally
 *
 * Percentage values:
 * - When `side` is `s`: A percentage string (e.g. '80%') represents overall scaling ratio
 * - When `side` is `s`: A number represents decimal percentage (1=100%)
 * - When `side` is `w`/`h`: A percentage string (e.g. '80%') represents scaling ratio for that dimension
 * - When `side` is `w`/`h`: A number represents the actual value after scaling, which will be used to calculate ratio
 *   (this behavior is different from `s`)
 *
 * @param size Actual image dimensions
 * @param side Which dimension to use for calculating the ratio
 * @param value Value for the scaling ratio
 * @returns The scaling ratio
 */
function parseRate(size: Size, side: ExactSide, value?: NumberString | Percentage): number {
  const isPrecent = typeof value === 'string' && value.endsWith('%')
  value = isPrecent ? Number((value as string).slice(0, -1)) : Number(value)

  if (Number.isNaN(value)) {
    return 1
  }

  // For overall proportional scaling.
  // Number value represents decimal percentage (1=100%)
  // String with % represents percentage
  if (side === 's') {
    const rate = isPrecent ? value / 100 : value
    return rate
  }

  // Provide width to calculate scaling ratio
  // Number value represents actual width after scaling
  // String with % represents percentage
  if (side === 'w') {
    const rate = isPrecent
      ? (value / 100 * size.width) / size.width // Calculate actual value then divide by width to get ratio
      : value / size.width // Directly divide by width to get ratio
    return rate
  }

  // Provide height to calculate scaling ratio
  // Number value represents actual height after scaling
  // String with % represents percentage
  if (side === 'h') {
    const rate = isPrecent
      ? (value / 100 * size.height) / size.height // Calculate actual value then divide by height to get ratio
      : value / size.height // Directly divide by height to get ratio
    return rate
  }

  return 1
}

function defaultTransformSize(size: Size): UnitSize {
  return {
    width: `${size.width}px`,
    height: `${size.height}px`,
  }
}
