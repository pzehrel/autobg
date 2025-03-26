import type { AliasConfig } from './options'
import { isAbsolute, join } from 'node:path'

export function normalizePath(path: string) {
  return path
    .replace(/^\[(.*)\]$/, '$1') // 去掉 []
    .replace(/^url\((.*)\)$/, '$1') // 去掉 url()
    .replace(/^['"](.*)['"]$/, '$1') // 去掉引号
}

export function isHttp(path: string) {
  return path.startsWith('http') || path.startsWith('//')
}

export function isRelative(path: string) {
  return !isAbsolute(path)
}

export function isAlias(path: string, aliasConfig: AliasConfig) {
  return Object.entries(aliasConfig).some(([key]) => path.startsWith(key))
}

export function getAliasSymbol(path: string, aliasConfig: AliasConfig) {
  return Object.entries(aliasConfig).find(([key]) => path.startsWith(key))?.[0]
}

export function aliasToRelativePath(path: string, aliasConfig: AliasConfig) {
  const alias = Object.entries(aliasConfig).find(([key]) => path.startsWith(key))
  if (!alias)
    return path

  const [key, value] = alias
  return path.replace(new RegExp(`^${key}`), value)
}

export function absoluteToAliasPath(path: string, root: string, aliasConfig: AliasConfig, aliasSymbol?: string) {
  path = path.replace(root, '')

  const alias = aliasSymbol ? Object.entries(aliasConfig).find(([key]) => key === aliasSymbol) : undefined
  if (alias) {
    const [symbol, aliasPath] = alias
    path = path.replace(new RegExp(`^/${aliasPath}`), '')
    path = join(symbol, path)
  }

  return path
}
