import type { RequiredConfig } from '@autobg/shared'
import type { Rule } from '@unocss/core'
import type { Store } from './store'
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, join } from 'node:path/posix'
import { isAlias } from '@autobg/shared'
import { imageSize } from 'image-size'
import { normalizePath } from './utils'

export function rules(options: RequiredConfig, store: Store): Rule<object>[] {
  return [
    [/^autobg-(.*)$/, ([, rawPath]) => {
      const root = store.root

      const path = normalizePath(rawPath)
      const filepath = resolveFilepath(path, root, options)
      const cssPath = resolveCssPath(filepath, options)

      const fullpath = join(root, filepath)
      let width: number | null = null
      let height: number | null = null
      if (existsSync(fullpath)) {
        const file = readFileSync(fullpath)
        const image = imageSize(file)
        width = image.width
        height = image.height
      }

      return {
        '--un-url': `url('${cssPath}')`,
        'background-image': `url('${cssPath}')`,
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center',
        'width': width ? `${width}px` : `unset`,
        'height': height ? `${height}px` : `unset`,
      }
    }],
  ]
}

/**
 * Parse file path, only return file paths relative to the project root directory
 * @param path
 * @param root
 * @param options
 */
function resolveFilepath(path: string, root: string, options: RequiredConfig) {
  const { alias, publicPath } = options

  // @/assets/bg.png -> /src/assets/bg.png
  if (isAlias(path, alias)) {
    const [symbol, value = ''] = Object.entries(alias).find(([k]) => path.startsWith(k)) || []
    if (!symbol) {
      return path
    }

    path = path.replace(new RegExp(`^${symbol}`), '')
    path = join('/', value, path)
    return path
  }

  // make sure the root path file exists
  // /file -> /public/file
  if (isAbsolute(path)) {
    const fillpath = join(root, path)
    // project root file exists
    if (existsSync(fillpath)) {
      return path
    }

    // public file exists
    if (publicPath && existsSync(join(root, publicPath, path))) {
      return join('/', publicPath, path)
    }
  }

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
