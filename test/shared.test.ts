import { aliasToRelativePath } from '@autobg/shared'
import { describe, expect, it } from 'vitest'

describe('aliasToRelativePath', () => {
  const aliasConfig = {
    '~@/': 'src',
    '@/': 'src',
    '~/': 'src',
  }

  it('应该正确处理 ~@/ 别名', () => {
    expect(aliasToRelativePath('~@/assets/images/logo.png', aliasConfig))
      .toBe('src/assets/images/logo.png')
  })

  it('应该正确处理 @/ 别名', () => {
    expect(aliasToRelativePath('@/assets/images/logo.png', aliasConfig))
      .toBe('src/assets/images/logo.png')
  })

  it('应该正确处理 ~/ 别名', () => {
    expect(aliasToRelativePath('~/assets/images/logo.png', aliasConfig))
      .toBe('src/assets/images/logo.png')
  })

  it('当路径不匹配任何别名时应该返回原始路径', () => {
    expect(aliasToRelativePath('assets/images/logo.png', aliasConfig))
      .toBe('assets/images/logo.png')
  })
})
