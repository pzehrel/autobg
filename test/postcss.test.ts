import postcss from 'postcss'
import { describe, expect, it } from 'vitest'
import { postcssAutobg } from '../packages/postcss/src'

describe('postcss', () => {
  it('should transform @autobg rule correctly', async () => {
    const input = `
      .test {
        @autobg url("./test.jpg");
      }
    `
    const result = await postcss([postcssAutobg()]).process(input, { from: undefined })

    expect(result.css).toMatchSnapshot()
  })

  it('should throw error when @autobg is used outside selector', async () => {
    const input = `
      @autobg url("./test.jpg");
    `

    await expect(
      postcss([postcssAutobg()]).process(input, { from: undefined }),
    ).rejects.toThrow('must be used inside the selector')
  })

  it('should throw error when @autobg has no params', async () => {
    const input = `
      .test {
        @autobg;
      }
    `

    await expect(
      postcss([postcssAutobg()]).process(input, { from: undefined }),
    ).rejects.toThrow('need a resource file path parameter')
  })

  it('should handle multiple @autobg rules', async () => {
    const input = `
      .test1 {
        @autobg url("./test1.jpg");
      }
      .test2 {
        @autobg url("./test2.jpg");
      }
    `
    const result = await postcss([postcssAutobg()]).process(input, { from: undefined })

    expect(result.css).toMatchSnapshot()
  })
})
