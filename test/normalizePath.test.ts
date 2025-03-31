import { expect, it } from 'vitest'
import { normalizePath } from '../packages/unocss/src/utils'

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
})
