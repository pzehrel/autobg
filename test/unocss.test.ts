import type { UnocssPluginContext } from '@unocss/core'
import { createGenerator } from '@unocss/core'
import MagicString from 'magic-string'
import { describe, expect, it } from 'vitest'
import { rules } from '../packages/unocss/src/rules'
import { createStore } from '../packages/unocss/src/store'
import { transformer as autobgTransformer } from '../packages/unocss/src/transformer'
import { configs, paths } from './util'

function createTransformer(platform: keyof typeof configs) {
  const { id, root, config } = configs[platform]
  const store = createStore()
  store.updateRoot({ configRoot: root })
  const transformer = autobgTransformer(config, store)
  async function transform(code: string) {
    const s = new MagicString(code)
    await transformer.transform(s, id, { root } as UnocssPluginContext)
    return s.toString()
  }
  return transform
}

describe('transformer', () => {
  for (const platform in configs) {
    const transform = createTransformer(platform as keyof typeof configs)

    for (const { type, path, realpath } of paths) {
      const url = type === 'relative' ? realpath : path

      it(`[${platform}] "${path}" should be converted to "${url}"`, async () => {
        const code = `<div class="autobg-[url(${path})]"/>`
        const result = await transform(code)
        expect(result).toBe(`<div class="autobg-[url(${url})]"/>`)
      })
    }
  }
})

describe('rule', async () => {
  for (const [platform, { config, root }] of Object.entries(configs)) {
    const transform = createTransformer(platform as keyof typeof configs)
    const generator = await createGenerator({
      rules: rules(config, { root }),
    })

    for (const { type, exist, path, realpath } of paths) {
      it(`[${platform}] "${path}" should be converted to ${realpath}.`, async () => {
        const code = await transform(`<div class="autobg-[url(${path})]"/>`)
        const result = await generator.generate(code)
        expect(result.css).toContain(`background-image:url('${realpath}')`)
        if (exist && type !== 'http') {
          expect(result.css).toContain(`width:2px;height:2px;`)
        }

        if (!exist || type === 'http') {
          expect(result.css).not.toContain(`width:2px;height:2px;`)
        }
      })
    }
  }
})
