import type { RequiredConfig } from './config'
import { existsSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import { isAlias, isRelative } from './utils'

/**
 * Resolve the filepath from the project root
 *
 * - alias path: '@/xxx' -> '${root}/src/xxx'
 * - relative path: './xxx' -> '${root}/src/xxx'
 * - absolute path: '/xxx' -> `${root}/public/xxx`
 * - http url: just return
 *
 * @param path
 * @param id
 * @param root
 * @param config
 * @returns File complete path
 */
export function resolveFilepath(path: string, id: string, root: string, config: RequiredConfig) {
  root = root.replace(/\\/g, '/')
  id = id.replace(/\\/g, '/')
  path = path.replace(/\\/g, '/')

  const { alias, publicPath } = config

  if (isAlias(path, alias)) {
    const [symbol, value = ''] = Object.entries(alias).find(([k]) => path.startsWith(k)) || []
    if (symbol) {
      path = path.replace(new RegExp(`^${symbol}`), '')
      path = join(root, value, path)
      return path
    }
    return path
  }

  // './xxx' -> '/src/xxx'
  if (isRelative(path)) {
    return id ? join(dirname(id), path) : path
  }

  // '/xxx' -> '/public/xxx'
  if (isAbsolute(path) && !path.startsWith(root)) {
    const fillpath = join(root, path)

    // project root file exists
    if (existsSync(fillpath)) {
      return fillpath
    }

    // fillpath not exists, public file exists
    if (publicPath) {
      const tmp = join(root, publicPath, path)
      return existsSync(tmp) ? tmp : path
    }
    return path
  }

  // http url
  return path
}

/**
 * Resolve the css path from the project root
 *
 * @param filepath
 * @param root
 * @param config
 * @returns Compiler can convert path
 */
export function resolveCsspath(filepath: string, root: string, config: RequiredConfig) {
  root = root.replace(/\\/g, '/')
  filepath = filepath.replace(/\\/g, '/')

  const csspath = filepath.replace(root, '')

  const { publicPath } = config
  if (publicPath && csspath.startsWith(`/${publicPath}`)) {
    return csspath.replace(new RegExp(`^/${publicPath}`), '')
  }
  return csspath
}
