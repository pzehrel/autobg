import type { NumberString, Percentage, Size, TransformSize } from './type'
import { imageSize } from './image-size'
import { isHttp } from './utils'

type Dimension = 'width' | 'height' | 'scale'
export type InputDimension = Dimension | 'w' | 'h' | 's'

export interface CreateCssOptions {
  /**
   * Determines which dimension to use for scaling
   *
   * - `w`/`width`: Fixed width, height automatically calculated proportionally
   * - `h`/`height`: Fixed height, width automatically calculated proportionally
   * - `s`/`scale`: Overall scaling (both dimensions scaled proportionally)
   */
  side?: InputDimension | (string & {})

  /**
   * Use the `aspect-ratio` property to maintain aspect ratio.
   * Especially suitable for responsive scaling scenarios when parent element dimensions change dynamically.
   *
   * When using this option, only one dimension's style property will be generated,
   * (the other dimension will be controlled by aspect-ratio)
   *
   * The generated dimension depends on the `side` value:
   * - When `side` is `w`/`width`: Generate width
   * - When `side` is `h`/`height`: Generate height
   */
  aspect?: boolean

  /**
   * Value used for scaling:
   *
   * For normal mode (when aspect=false):
   * - When `side` is `w`/`width` or `h`/`height`: Numeric value represents pixels
   * - When `side` is `s`/`scale`: Numeric value represents scale ratio, percentage represents scale ratio
   *
   * For aspect-ratio mode (when aspect=true):
   * - Both numeric values and percentages are treated as percentage values
   */
  value?: NumberString | Percentage

  /** Function to transform size units */
  transformSize?: TransformSize
}

/**
 * Create CSS styles
 * @param csspath Path referenced in CSS (compiler can transform this path)
 * @param filepath The actual path of the image
 * @param options Configuration options
 */
export function createCSS(csspath: string, filepath?: string, options?: CreateCssOptions): Record<string, string> {
  const size = filepath && !isHttp(csspath) ? imageSize(filepath) : null
  const css: Record<string, string> = {
    'background-image': `url('${csspath}')`,
    'background-repeat': 'no-repeat',
    'background-size': 'contain',
    'background-position': 'center',
  }

  const side = formatSide(options?.side)
  const value = parseNumberString(options?.value)

  const whcss = options?.aspect
    ? createAspectCSS(size, side, value)
    : createScaleCSS(size, side, value)

  const { transformSize } = options ?? {}
  if (transformSize) {
    if (whcss.width !== undefined && typeof whcss.width === 'number') {
      whcss.width = transformSize(whcss.width)
    }
    if (whcss.height !== undefined && typeof whcss.height === 'number') {
      whcss.height = transformSize(whcss.height)
    }
  }

  return Object.assign(css, whcss)
}

function createScaleCSS(size: Size | null, side: Dimension = 'scale', value: number | string = 1) {
  const css: Record<string, string> = {}

  if (!size) {
    return css
  }

  const isPercent = typeof value === 'string' && value.endsWith('%')
  const v = isPercent ? Number(value.slice(0, -1)) / 100 : Number(value)

  if (side === 'scale') {
    const rate = v // Any value will be treated as a ratio (75, 0.5, 100%)
    return {
      width: size.width * rate,
      height: size.height * rate,
    }
  }

  // Percentage values will be treated as ratios (75%)
  // Numeric values will be converted to decimal ratios (0.75)
  const rate = isPercent
    ? v
    : v / (side === 'width' ? size.width : size.height)

  return {
    width: size.width * rate,
    height: size.height * rate,
  }
}

function createAspectCSS(size: Size | null, side: Dimension | undefined, value: number | string | undefined = '100%') {
  const css: Record<string, string> = {
    'aspect-ratio': size ? `${size.width}/${size.height}` : '1/1',
  }

  // No dimension provided, no need to set width and height
  if (!side) {
    return css
  }

  if (side === 'scale') {
    side = 'height'
  }

  // aspect-ratio value will be calculated automatically, so value just needs to be returned as is
  return Object.assign(css, { [side]: value })
}

function formatSide(side?: InputDimension | (string & {})): Dimension | undefined {
  if (side === 'w' || side === 'width')
    return 'width'
  if (side === 'h' || side === 'height')
    return 'height'
  if (side === 's' || side === 'scale')
    return 'scale'
  return undefined
}

function parseNumberString(value: NumberString | undefined | null): number | string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }
  if (typeof value === 'string') {
    const num = Number(value)
    return Number.isNaN(num) ? value : num
  }
  return value
}

export interface ValueErrorMessage {
  message: string
}

/**
 * Validate if the value is valid
 * @param value The value
 * @param aspect Whether to use aspect-ratio mode
 */
export function validateValue(value: number | string | undefined, aspect: boolean): true | ValueErrorMessage {
  if (aspect) {
    return true
  }

  // Non-aspect mode
  // Values that are undefined, null, number, or percentage strings are considered valid
  if (value === undefined || value === null || typeof value === 'number' || value.endsWith('%')) {
    return true
  }

  // Numeric values with units
  if (Number.isNaN(Number(value))) {
    // const match = value.match(/^[-+]?\d+(?:\.\d+)?(?:[a-z]+)?$/i)
    return {
      message: `Invalid value: ${value}, expected number or percentage`,
    }
  }

  return true
}
