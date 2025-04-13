import type { NumberString, Percentage, Size, UnitSize } from './type'
import { imageSize } from './image-size'
import { isHttp } from './utils'

export interface StyleOptions {
  /**
   * Target width. If only this is provided, height will be automatically calculated
   * to maintain the original aspect ratio. At least one of 'sw' or 'sh' must be provided
   */
  sw?: NumberString
  /**
   * Target height. If only this is provided, width will be automatically calculated
   * to maintain the original aspect ratio. At least one of 'sw' or 'sh' must be provided
   */
  sh?: NumberString
  /**
   * Uniform scale factor (preserves aspect ratio). Applied to both width and height.
   *
   * If string, it must end with '%', which will be converted to decimal. e.g. '78%' converts to 0.78
   * If number, it represents a decimal percentage, e.g. 0.78
   */
  ss?: NumberString | Percentage
  /** Size unit transformation function */
  transformSize?: (size: Size) => UnitSize
}

/**
 * Create a style object.
 * @param csspath - The path to the CSS file path or url.
 * @param filepath - The path to the image file path.
 * @param options - The options.
 */
export function createStyle(csspath: string, filepath?: string, options?: StyleOptions) {
  const { transformSize = defaultTransformSize, sw, sh, ss } = options ?? {}

  const style: Record<string, string> = {
    'background-image': `url('${csspath}')`,
    'background-repeat': 'no-repeat',
    'background-size': 'contain',
    'background-position': 'center',
  }

  if (!isHttp(csspath) && filepath) {
    const size = imageSize(filepath)
    if (size) {
      Object.assign(style, transformSize(scale(size, sw, sh, ss)))
    }
  }

  return style
}

function defaultTransformSize(size: Size): UnitSize {
  return {
    width: `${size.width}px`,
    height: `${size.height}px`,
  }
}

/**
 * Scale the size while preserving aspect ratio.
 * @param size - The original size to scale.
 * @param sw - The target width (aspect ratio will be preserved).
 * @param sh - The target height (aspect ratio will be preserved).
 * @param ss - The uniform scale factor (applied to both dimensions).
 */
function scale(size: Size, sw?: NumberString, sh?: NumberString, ss?: NumberString | Percentage): Size {
  sw = Number(sw)
  sh = Number(sh)
  ss = formatSS(ss)

  if (!sw && !sh && !ss) {
    return size
  }

  const rate = ss || (sw ? sw / size.width : sh ? sh / size.height : 1)

  const width = size.width * rate
  const height = size.height * rate

  return { width, height }
}

/**
 * Format the scale factor (percentage).
 * @param ss - The scale factor.
 * @returns The formatted scale factor.
 */
function formatSS(ss: number | Percentage | undefined): number | undefined {
  if (!ss) {
    return undefined
  }

  if (typeof ss === 'string' && ss.endsWith('%')) {
    return Number(ss.slice(0, -1)) / 100
  }

  ss = Number(ss)
  return Number.isNaN(ss) ? undefined : ss
}
