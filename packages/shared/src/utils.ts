import type { AliasConfig } from './config'
import { isAbsolute } from 'node:path'

export function isHttp(url: string) {
  return /^(?:https?:)?\/\//.test(url)
}

export function isDataUrl(url: string) {
  return /^data:image\/\w+;base64,/.test(url)
}

export function isRelative(path: string) {
  if (isHttp(path) || isDataUrl(path) || isAbsolute(path)) {
    return false
  }
  return /^[.\w]/.test(path)
}

export function isAlias(path: string, aliasConfig: AliasConfig) {
  return Object.entries(aliasConfig).some(([key]) => path.startsWith(key))
}

/**
 * Normalize the path of the url() function
 *
 * @see [regexp101](https://regex101.com/r/WXZhLl/1)
 *
 * @param path - The path to normalize
 * @returns The normalized path
 */
export function normalizePath(path: string) {
  return path.replace(/^\[?(?:url\(?)?\(?['"]?(.+?)['"]?\)?\]?$/, '$1')
}
