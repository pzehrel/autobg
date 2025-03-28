import type { RequiredConfig } from '@autobg/shared'
import type { Rule } from '@unocss/core'
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { join } from 'node:path/posix'
import process from 'node:process'
import { aliasToRelativePath, isAlias } from '@autobg/shared'
import { imageSize } from 'image-size'
import { normalizePath } from './utils'

export function rules(options: RequiredConfig): Rule<object>[] {
  const root = process.cwd()
  const { publicPath, alias } = options
  return [
    [/^autobg-(.*)$/, ([, rawPath]) => {
      const path = normalizePath(rawPath)

      let url = path
      // 如果使用了publicPath，且路径以publicPath开头，则去掉publicPath，交给编译器处理
      if (publicPath && path.startsWith(`/${publicPath}`)) {
        url = path.replace(new RegExp(`^/${publicPath}`), '')
      }

      let filePath = path
      if (isAbsolute(filePath)) {
        filePath = join(root, filePath)
      }
      else if (isAlias(filePath, alias)) {
        filePath = aliasToRelativePath(filePath, alias)
        filePath = resolve(root, filePath)
      }

      let width: number | null = null
      let height: number | null = null
      if (existsSync(filePath)) {
        const file = readFileSync(filePath)
        const image = imageSize(file)
        width = image.width
        height = image.height
      }

      return {
        '--un-url': `url('${url}')`,
        'background-image': 'var(--un-url)',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center',
        'width': width ? `${width}px` : `unset`,
        'height': height ? `${height}px` : `unset`,
      }
    }],
  ]
}
