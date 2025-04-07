import { resolve } from 'node:path'
import { vi } from 'vitest'
import { configs, filelist } from './util'

const roots = Object.values(configs).reverse().map(c => c.root.replace(/\\/g, '/'))
function toAbs(path: string) {
  path = path.replace(/\\/g, '/')
  path = roots.reduce((acc, root) => acc.replace(root, ''), path)
  return path
}

vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs')

  const existsSync = vi.fn((path) => {
    path = toAbs(path)
    return filelist.includes(path)
  })
  return {
    ...actual,
    existsSync,
    readFileSync: vi.fn((path, options) => {
      path = toAbs(path)
      // If the file does not exist in the filelist, throw an error
      if (!existsSync(path)) {
        throw new Error(`File ${path} does not exist`)
      }
      // if file exists, return the file content
      return actual.readFileSync(resolve(import.meta.dirname, 'assets/foo.png'), options)
    }),
  }
})
