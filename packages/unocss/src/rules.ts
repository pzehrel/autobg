import type { RequiredAutobgUnocssConfig } from './config'
import type { Store } from './store'
import { aspect } from './rule-aspect'
import { autobg } from './rule-autobg'

export { aspect, autobg }

export function createRules(options: RequiredAutobgUnocssConfig, store: Store) {
  return [
    ...autobg.rules(options, store),
    ...aspect.rules(options, store),
  ]
}
