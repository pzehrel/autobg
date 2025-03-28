import type { AliasConfig } from '@autobg/shared'
import { join } from 'node:path'

export function normalizePath(path: string) {
  return path
    .replace(/^\[(.*)\]$/, '$1') // 去掉 []
    .replace(/^url\((.*)\)$/, '$1') // 去掉 url()
    .replace(/^['"](.*)['"]$/, '$1') // 去掉引号
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
