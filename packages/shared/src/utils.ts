import type { AliasConfig } from './config'
import { isAbsolute } from 'node:path'

export function isHttp(url: string) {
  return /^https?:\/\//.test(url) || /^\/\//.test(url)
}

export function isDataUrl(url: string) {
  return /^data:image\/\w+;base64,/.test(url)
}

export function isRelative(path: string) {
  return !isHttp(path) && !isDataUrl(path) && !isAbsolute(path)
}

export function isAlias(path: string, aliasConfig: AliasConfig) {
  return Object.entries(aliasConfig).some(([key]) => path.startsWith(key))
}
