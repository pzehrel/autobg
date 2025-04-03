import { defineBuildConfig } from 'unbuild'
import { alias } from '../../alias'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  alias,
})
