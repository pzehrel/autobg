import type { Input } from 'postcss'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'
import { createProcessor } from '../packages/postcss/src/processor'
import { configs, paths } from './util'

function createPostcss(params: string, id: string, selector?: string, aspect?: boolean) {
  const root = postcss.root()
  const atRule = postcss.atRule({ name: aspect ? 'autobg-aspect' : 'autobg', params })

  // mock source file
  atRule.source = { input: { file: id } as Input }

  if (selector) {
    const rule = postcss.rule({ selector })
    rule.append(atRule)
    root.append(rule)
  }
  else {
    root.append(atRule)
  }

  return { root, atRule }
}

describe('postcss', () => {
  for (const [platform, { config, root: cwd, id }] of Object.entries(configs)) {
    for (const { type, path, realpath, exist } of paths) {
      it(`[${platform}] "${path}" should be converted to "${realpath}"`, async () => {
        const processor = createProcessor(config, cwd, false)
        const { root, atRule } = createPostcss(`url(${path})`, id, '.test', false)
        processor(atRule)
        const css = root.toString()

        expect(css).toContain(`background-image: url('${realpath}')`)

        if (exist && type !== 'http') {
          expect(css).toContain(`width: 2px;`)
          expect(css).toContain(`height: 2px;`)
        }

        if (!exist || type === 'http') {
          expect(css).not.toContain(`width: 2px;`)
          expect(css).not.toContain(`height: 2px;`)
        }
      })
    }
  }
})

describe('scaling', async () => {
  const classnames = [
    { name: 'url(/foo.png)', contain: [`aspect-ratio: 2/2`], not: ['width: 2px'] },
    { name: 'url(/foo.png) w(200)', contain: [`aspect-ratio: 2/2`, `width: 200px`] },
    { name: 'url(/foo.png) h(200)', contain: [`aspect-ratio: 2/2`, `height: 200px`] },
    { name: 'url(/foo.png) s(0.78)', contain: [`aspect-ratio: 2/2`, `height: 0.78px`] },
    { name: 'url(/foo.png) scale(78%)', contain: [`aspect-ratio: 2/2`, `height: 78%`] },

    { name: 'url(/foo.png) h()', contain: [`aspect-ratio: 2/2;`, `height: 100%;`] },
    { name: 'url(/foo.png) w(200)', contain: [`aspect-ratio: 2/2;`, `width: 200px;`] },
    { name: 'url(/foo.png) height(200)', contain: [`aspect-ratio: 2/2;`, `height: 200px;`] },
  ]

  for (const { name, contain, not } of classnames) {
    it(`"${name}" \t should be ${contain}`, async () => {
      const { config, root: cwd, id } = configs.posix
      const processor = createProcessor(config, cwd, true)
      const { root, atRule } = createPostcss(name, id, '.test', true)
      processor(atRule)
      const css = root.toString()
      for (const item of contain) {
        expect(css).toContain(item)
      }
      if (not) {
        for (const item of not) {
          expect(css).not.toContain(item)
        }
      }
    })
  }
})
