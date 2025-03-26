import { existsSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'

export function isHttp(url: string) {
  return /^https?:\/\//.test(url) || /^\/\//.test(url)
}

export function isDataUrl(url: string) {
  return /^data:image\/\w+;base64,/.test(url)
}

export function isAbsolutePath(url: string) {
  return url.startsWith('/')
}

export function isRelativePath(url: string) {
  return !isHttp(url) && !isDataUrl(url) && !isAbsolutePath(url)
}

export function isRelative(path: string) {
  return !isAbsolute(path)
}

export type AliasConfig = Record<string, string>

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
  const v = key.endsWith('/') ? `${value}/` : value
  return path.replace(new RegExp(`^${key}`), v)
}

interface ResolveFilePathOptions {
  /**
   * css 传入的路径
   */
  cssPath: string
  /**
   * 别名配置
   */
  alias: AliasConfig
  /**
   * 文件 id
   */
  id: string
  /**
   * 项目根目录
   */
  root: string
  /**
   * 公共路径
   */
  publicPath: false | string
}

/**
 * 解析 css 传入的路径，支持别名路径、相对路径、项目绝对路径
 *
 * 1. 别名路径，转为绝对路径 eg. '@/xxx' -> '/src/xxx'
 * 2. 相对路径，转为绝对路径 eg. './xxx' -> '/src/xxx'
 * 3. 项目绝对路径 eg. '/xxx' -> '/public/xxx'
 *
 * @param options
 * @returns
 */
export function resolveFilePath(options: ResolveFilePathOptions) {
  const { cssPath, alias, root, publicPath, id } = options
  let filePath = cssPath

  // 别名路径，转为绝对路径 eg. '@/xxx' -> '/src/xxx'
  if (isAlias(filePath, alias)) {
    filePath = aliasToRelativePath(filePath, alias)
    filePath = resolve(root, filePath)
  }

  // 相对路径，转为绝对路径 eg. './xxx' -> '/src/xxx'
  if (isRelative(filePath)) {
    filePath = resolve(dirname(id), filePath)
  }

  // 绝对路径，且不是以系统根目录开头 eg. '/xxx' -> '/public/xxx'
  if (isAbsolute(filePath) && !filePath.startsWith(root)) {
    const apath = filePath.replace(/^\//, '')
    const tmpPath = resolve(root, apath)
    if (!existsSync(tmpPath) && publicPath) {
      filePath = join(root, publicPath, filePath)
    }
  }

  return filePath
}
