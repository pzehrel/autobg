import { Buffer } from 'node:buffer'
import { readFileSync } from 'node:fs'
import { imageSize as _imageSize } from 'image-size'
import { isDataUrl } from './utils'

const base64HeadRE = /^data:image\/[a-z]+;base64,/i

export function imageSize(filepath: string | Buffer): { width: number, height: number } | null {
  try {
    if (typeof filepath === 'string') {
      filepath = isDataUrl(filepath) ? base64ToBuffer(filepath) : readFileSync(filepath)
    }
    const { width, height } = _imageSize(filepath)
    return { width, height }
  }
  catch {
    return null
  }
}

export function base64ToBuffer(dataUrl: string): Buffer {
  const data = dataUrl.replace(base64HeadRE, '')
  return Buffer.from(data, 'base64')
}
