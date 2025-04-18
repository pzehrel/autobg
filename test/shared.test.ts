import { join } from 'node:path'
import { imageSize, isAlias, isHttp, isRelative, normalizePath, resolveFilepath } from '@autobg/shared'
import { describe, expect, it, vi } from 'vitest'
import { configs, paths } from './util'

describe('shared image-size', () => {
  vi.resetModules()

  // 2x2 png
  const b64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEX///+nxBvIAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg=='

  it('base64', () => {
    const size = imageSize(b64)
    expect(size).toEqual(expect.objectContaining({ width: 2, height: 2 }))
  })
})

describe('filepath and csspath', () => {
  for (const [platform, { root, id, config }] of Object.entries(configs)) {
    for (const { type, path, realpath } of paths) {
      it(`[${platform}] ${type} ${path} -> ${realpath}`, () => {
        const filepath = resolveFilepath(path, id, root, config)
        if (type === 'http') {
          expect(filepath).toEqual(realpath)
        }
        else if (type === 'absolute') {
          expect(filepath).toBeOneOf([
            realpath,
            join(root, realpath).replace(/\\/g, '/'),
            join(root, config.publicPath, realpath).replace(/\\/g, '/'),
          ])
        }
        else {
          expect(filepath).toEqual(join(root, realpath).replace(/\\/g, '/'))
        }
      })
    }
  }
})

it('normalizePath', () => {
  // Test url() format with double quotes
  expect(normalizePath('[url("/test.png")]')).toBe('/test.png')
  expect(normalizePath('[url("./assets/test.png")]')).toBe('./assets/test.png')
  expect(normalizePath('[url("../assets/test.png")]')).toBe('../assets/test.png')
  expect(normalizePath('[url("@/assets/test.png")]')).toBe('@/assets/test.png')

  // Test url() format with single quotes
  expect(normalizePath('[url(\'/test.png\')]')).toBe('/test.png')
  expect(normalizePath('[url(\'./assets/test.png\')]')).toBe('./assets/test.png')
  expect(normalizePath('[url(\'../assets/test.png\')]')).toBe('../assets/test.png')
  expect(normalizePath('[url(\'@/assets/test.png\')]')).toBe('@/assets/test.png')

  // Test url() format without quotes
  expect(normalizePath('[url(/test.png)]')).toBe('/test.png')
  expect(normalizePath('[url(./assets/test.png)]')).toBe('./assets/test.png')
  expect(normalizePath('[url(../assets/test.png)]')).toBe('../assets/test.png')
  expect(normalizePath('[url(@/assets/test.png)]')).toBe('@/assets/test.png')

  // Test direct path format
  expect(normalizePath('[/test.png]')).toBe('/test.png')
  expect(normalizePath('[./assets/test.png]')).toBe('./assets/test.png')
  expect(normalizePath('[../assets/test.png]')).toBe('../assets/test.png')
  expect(normalizePath('[@/assets/test.png]')).toBe('@/assets/test.png')

  // Test path with double quotes
  expect(normalizePath('["/test.png"]')).toBe('/test.png')
  expect(normalizePath('["./assets/test.png"]')).toBe('./assets/test.png')
  expect(normalizePath('["../assets/test.png"]')).toBe('../assets/test.png')
  expect(normalizePath('["@/assets/test.png"]')).toBe('@/assets/test.png')

  // Test path with single quotes
  expect(normalizePath(`['/test.png']`)).toBe('/test.png')
  expect(normalizePath(`['./assets/test.png']`)).toBe('./assets/test.png')
  expect(normalizePath(`['../assets/test.png']`)).toBe('../assets/test.png')
  expect(normalizePath(`['@/assets/test.png']`)).toBe('@/assets/test.png')

  // Test path with single quotes
  expect(normalizePath(`'/test.png'`)).toBe('/test.png')
  expect(normalizePath(`'./assets/test.png'`)).toBe('./assets/test.png')
  expect(normalizePath(`'../assets/test.png'`)).toBe('../assets/test.png')
  expect(normalizePath(`'@/assets/test.png'`)).toBe('@/assets/test.png')

  // Test path with single quotes
  expect(normalizePath(`('/test.png')`)).toBe('/test.png')
  expect(normalizePath(`('./assets/test.png')`)).toBe('./assets/test.png')
  expect(normalizePath(`('../assets/test.png')`)).toBe('../assets/test.png')
  expect(normalizePath(`('@/assets/test.png')`)).toBe('@/assets/test.png')
})

describe('utils', () => {
  it('is https', () => {
    expect(isHttp('https://foo.com/bar.png')).toBe(true)
    expect(isHttp('http://foo.com/bar.png')).toBe(true)
    expect(isHttp('//foo.com/bar.png')).toBe(true)
    expect(isHttp('foo.com/bar.png')).toBe(false)
  })

  it('is alias', () => {
    expect(isAlias('@/assets/foo.png', { '@/': 'src' })).toBe(true)
    expect(isAlias('~@/assets/foo.png', { '~@/': 'src' })).toBe(true)
    expect(isAlias('./assets/foo.png', { '@/': 'src' })).toBe(false)
    expect(isAlias('../assets/foo.png', { '@/': 'src' })).toBe(false)
    expect(isAlias('/assets/foo.png', { '@/': 'src' })).toBe(false)
  })

  it('is relative', () => {
    expect(isRelative('@/assets/foo.png')).toBe(false)
    expect(isRelative('~@/assets/foo.png')).toBe(false)
    expect(isRelative('./assets/foo.png')).toBe(true)
    expect(isRelative('../assets/foo.png')).toBe(true)
    expect(isRelative('/assets/foo.png')).toBe(false)
    expect(isRelative('https://foo.com/bar.png')).toBe(false)
  })
})
