import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  alias: {
    '@autobg/shared': resolve(fileURLToPath(new URL('.', import.meta.url)), '../shared/src'),
  },
})
