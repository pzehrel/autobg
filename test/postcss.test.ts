import postcss from 'postcss'
import { describe, expect, it } from 'vitest'
import { postcssAutobg } from '../packages/postcss/src'

describe('postcss autobg plugin', () => {
  it('should transform @autobg rule correctly', async () => {
    const input = `
      .test {
        @autobg "./test.jpg";
      }
    `
    const result = await postcss([postcssAutobg()]).process(input, { from: undefined })

    expect(result.css).toMatchSnapshot()
  })

  it('should throw error when @autobg is used outside selector', async () => {
    const input = `
      @autobg "./test.jpg";
    `

    await expect(
      postcss([postcssAutobg()]).process(input, { from: undefined }),
    ).rejects.toThrow('@autobg 必须在选择器内部使用')
  })

  it('should throw error when @autobg has no params', async () => {
    const input = `
      .test {
        @autobg;
      }
    `

    await expect(
      postcss([postcssAutobg()]).process(input, { from: undefined }),
    ).rejects.toThrow('@autobg 需要一个图片路径参数')
  })

  it('should handle multiple @autobg rules', async () => {
    const input = `
      .test1 {
        @autobg "./test1.jpg";
      }
      .test2 {
        @autobg "./test2.jpg";
      }
    `
    const result = await postcss([postcssAutobg()]).process(input, { from: undefined })

    expect(result.css).toMatchSnapshot()
  })
})
