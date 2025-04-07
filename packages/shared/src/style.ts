import { imageSize } from './image-size'
import { isHttp } from './utils'

export interface StyleOptions {
  /** resize width */
  width?: number
  /** resize height */
  height?: number
  /** aspect ratio */
  aspectRatio?: number

  transformSize?: (size: { width: number, height: number }) => { width: string, height: string }
}

export function createStyle(csspath: string, filepath?: string, options?: StyleOptions) {
  const style: Record<string, string> = {
    'background-image': `url('${csspath}')`,
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'background-position': 'center',
  }

  if (!isHttp(csspath) && filepath) {
    const size = imageSize(filepath)
    if (size) {
      const { width, height } = options?.transformSize?.(size) ?? defaultTransformSize(size)
      style.width = width
      style.height = height
    }
  }

  return style
}

function defaultTransformSize(size: { width: number, height: number }) {
  return {
    width: `${size.width}px`,
    height: `${size.height}px`,
  }
}
