import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  typescript: true,

  rules: {
    'ts/explicit-function-return-type': 'off',
    'jsdoc/require-returns-description': 'off',
  },
})
