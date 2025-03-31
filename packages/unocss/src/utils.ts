import type { AliasConfig } from '@autobg/shared'
import { join } from 'node:path'

/**
 * Normalize the path of the url() function
 *
 * @see [regexp101](https://regex101.com/r/WXZhLl/1)
 *
 * @param path - The path to normalize
 * @returns The normalized path
 */
export function normalizePath(path: string) {
  return path.replace(/^\[?(?:url\(?)?['"]?(.+?)['"]?\)?\]?$/, '$1')
}

/**
 * @deprecated
 */
export function absoluteToAliasPath(path: string, root: string, aliasConfig: AliasConfig, aliasSymbol?: string) {
  // path = normalize(path.replace(root, ''))

  const alias = aliasSymbol ? Object.entries(aliasConfig).find(([key]) => key === aliasSymbol) : undefined
  if (alias) {
    const [symbol, aliasPath] = alias
    path = path.replace(new RegExp(`^/${aliasPath}`), '')
    path = join(symbol, path)
  }

  return path
}
