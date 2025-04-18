import type { DynamicMatcher, Rule } from '@unocss/core'
import type { RequiredAutobgUnocssConfig } from './config'
import type { Store } from './store'
import { createCSS, resolveCsspath, resolveFilepath } from '@autobg/shared'

export type Processor = (path: string, side?: string, value?: string | number, aspect?: boolean) => ReturnType<DynamicMatcher<object>>

export function createRuleRegExps(processor?: Processor) {
  return [
    [/^autobg-\[(url.+?)\]$/, ([, path]) => {
      return processor?.(path)
    }],
    [/^autobg-\[(url.+?)\]-(\d+(?:\.\d+)?%?)$/, ([, path, value]) => {
      return processor?.(path, undefined, value)
    }],
    [/^autobg-\[(url.+?)\]-(w|h|width|height)-?(\d+(?:\.\d+)?%?)$/, ([, path, side, value]) => {
      return processor?.(path, side, value)
    }],

    [/^autobg-(?:aspect|asp)-\[(url.+?)\]$/, ([, path]) => {
      return processor?.(path, undefined, undefined, true)
    }],
    [/^autobg-(?:aspect|asp)-\[(url.+?)\]-(\d+(?:\.\d+)?[a-zA-Z%]*)$/, ([, path, value]) => {
      return processor?.(path, 'height', value, true)
    }],
    [/^autobg-(?:aspect|asp)-\[(url.+?)\]-(w|h|width|height)(?:-?(\d+(?:\.\d+)?[a-zA-Z%]*))?$/, ([, path, side, value]) => {
      return processor?.(path, side, value, true)
    }],
  ] satisfies [RegExp, DynamicMatcher<object>][]
}

export function rules(options: RequiredAutobgUnocssConfig, store: Store): Rule<object>[] {
  return createRuleRegExps((path, side, value, aspect) => {
    path = path.replace(/url\(['"]?(.+?)['"]?\)/, '$1')
    const filepath = resolveFilepath(path, '', store.root, options)
    const csspath = resolveCsspath(filepath, store.root, options)

    return createCSS(csspath, filepath, {
      side,
      value,
      aspect,
      transformSize: options.transformSize ?? (value => `${value}px`),
    })
  })
}
