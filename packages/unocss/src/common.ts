import type { DynamicMatcher } from '@unocss/core'
import type { RequiredAutobgUnocssConfig } from './config'
import type { Store } from './store'
import { resolveCsspath, resolveFilepath } from '@autobg/shared'

export function resolvePath(path: string, options: RequiredAutobgUnocssConfig, store: Store) {
  path = path.replace(/url\(['"]?(.+?)['"]?\)/, '$1')
  const filepath = resolveFilepath(path, '', store.root, options)
  const csspath = resolveCsspath(filepath, store.root, options)
  return { filepath, csspath }
}

interface Context {
  options: RequiredAutobgUnocssConfig
  store: Store
  filepath: string
  csspath: string
}

interface DefineRuleOptions<Args extends any[]> {
  /** 规则的正则表达式 */
  regexps: (processor?: (...args: Args) => ReturnType<DynamicMatcher>) => [RegExp, DynamicMatcher<object>][]

  /** unocss DynamicRule 所需要的 matcher 函数封装 */
  prematcher: (context: Context, args: Args) => ReturnType<DynamicMatcher>

  /** unocss transformer 模糊匹配的正则表达式 */
  fuzzyPatterns: RegExp | RegExp[]
}

interface DefineRuleReturn<Args extends any[]> extends Omit<DefineRuleOptions<Args>, 'prematcher' | 'fuzzyPatterns'> {

  /** unocss 规则 */
  rules: (options: RequiredAutobgUnocssConfig, store: Store) => [RegExp, DynamicMatcher<object>][]

  /** unocss transformer 模糊匹配的正则表达式 */
  fuzzyPatterns: string[]

  /** unocss transformer 精确匹配的正则表达式 */
  exactPatterns: RegExp[]
}

export function defineRule<Args extends [path: string, ...args: any[]]>({
  regexps,
  prematcher,
  fuzzyPatterns,
}: DefineRuleOptions<Args>): DefineRuleReturn<Args> {
  const rules = (options: RequiredAutobgUnocssConfig, store: Store) => {
    const processor = (...args: Args) => {
      const { filepath, csspath } = resolvePath(args[0], options, store)
      const context: Context = { options, store, filepath, csspath }
      return prematcher(context, args)
    }
    return regexps(processor)
  }

  const exactPatterns = regexps().map(([regexp]) => regexp)

  fuzzyPatterns = Array.isArray(fuzzyPatterns) ? fuzzyPatterns : [fuzzyPatterns]
  const fuzzy = fuzzyPatterns.map(regexp => regexp.source)

  return { regexps, rules, fuzzyPatterns: fuzzy, exactPatterns }
}
