import { createCSS } from '@autobg/shared'
import { defineRule } from './common'

type Args = [path: string, side?: string, value?: string | number, aspect?: boolean]

export const autobg = defineRule<Args>({
  fuzzyPatterns: /(?<autobg>autobg)-\[url\(.+?\)\][a-zA-Z0-9-%]*/,

  regexps: processor => [
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
  ],

  prematcher: ({ filepath, csspath, options }, [, side, value, aspect]) => createCSS(csspath, filepath, {
    side,
    value,
    aspect,
    transformSize: options.transformSize ?? (value => `${value}px`),
  }),

})
