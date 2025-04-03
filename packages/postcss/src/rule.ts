import type { RequiredConfig } from '@autobg/shared'
import type { AtRule } from 'postcss'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { isAlias, isHttp, isRelative, normalizePath } from '@autobg/shared'
import imageSize from 'image-size'

export function createAutobgAtRule(config: RequiredConfig, root: string) {
  return (rule: AtRule) => {
    const cssPath = normalizePath(rule.params.trim().replace(/^\(|\)$/, ''))
    console.log('cssPath', cssPath)

    if (!cssPath) {
      throw rule.error('need a resource file path parameter')
    }

    const parent = rule.parent
    if (!parent || !('selector' in parent) || typeof parent.selector !== 'string') {
      throw rule.error('must be used inside the selector')
    }

    const id = rule.source?.input.file || ''
    const filePath = resolveFilepath(cssPath, id, root, config)
    const path = resolveCssPath(filePath.replace(root, ''), config)

    parent.prepend(
      { prop: 'background-image', value: `url('${path}')` },
      { prop: 'background-size', value: 'cover' },
      { prop: 'background-position', value: 'center' },
      { prop: 'background-repeat', value: 'no-repeat' },
    )

    if (!isHttp(cssPath)) {
      if (existsSync(filePath)) {
        const file = readFileSync(filePath)
        const { width, height } = imageSize(file)
        parent.prepend({ prop: 'width', value: `${width}px` })
        parent.prepend({ prop: 'height', value: `${height}px` })
      }
    }

    // 移除 @autobg 规则
    rule.remove()
  }
}

function resolveFilepath(path: string, id: string, root: string, config: RequiredConfig) {
  const { alias, publicPath } = config

  path = path.replace(/\\/g, '/')
  root = root.replace(/\\/g, '/')
  id = id.replace(/\\/g, '/')

  // '@/xxx' -> '/src/xxx'
  if (isAlias(path, alias)) {
    const [symbol, value = ''] = Object.entries(alias).find(([k]) => path.startsWith(k)) || []
    if (symbol) {
      path = path.replace(new RegExp(`^${symbol}`), '')
      path = join(root, value, path)
      return path
    }
  }

  // './xxx' -> '/src/xxx'
  if (isRelative(path)) {
    if (!id) {
      return path
    }
    path = resolve(dirname(id), path)
    return path
  }

  // '/xxx' -> '/public/xxx'
  if (isAbsolute(path) && !path.startsWith(root)) {
    const fillpath = join(root, path)

    // project root file exists
    if (existsSync(fillpath)) {
      return path
    }

    // public file exists
    if (publicPath) {
      const tmp = join(root, publicPath, path)
      if (existsSync(tmp)) {
        return tmp
      }
    }
  }

  // http
  return path
}

function resolveCssPath(filepath: string, options: RequiredConfig) {
  filepath = filepath.replace(/\\/g, '/')
  const { publicPath } = options
  if (publicPath && filepath.startsWith(`/${publicPath}`)) {
    return filepath.replace(new RegExp(`^/${publicPath}`), '')
  }
  return filepath
}
