import { createCSS } from '@autobg/shared'
import { defineRule } from './common'

type Args = [path: string, side?: string, value?: string | number]

export const aspect = defineRule<Args>({
  fuzzyPatterns: /(?<aspect>autobg(?:-asp|-aspect))-\[url\(.+?\)\][a-zA-Z0-9-%]*/,

  regexps: processor => [
    [/^autobg-(?:aspect|asp)-\[(url.+?)\]$/, ([, path]) => {
      return processor?.(path, undefined, undefined)
    }],
    [/^autobg-(?:aspect|asp)-\[(url.+?)\]-(\d+(?:\.\d+)?[a-zA-Z%]*)$/, ([, path, value]) => {
      return processor?.(path, 'height', value)
    }],
    [/^autobg-(?:aspect|asp)-\[(url.+?)\]-(w|h|width|height)(?:-?(\d+(?:\.\d+)?[a-zA-Z%]*))?$/, ([, path, side, value]) => {
      return processor?.(path, side, value)
    }],
  ],

  prematcher: ({ filepath, csspath, options }, [, side, value]) => createCSS(csspath, filepath, {
    side,
    value,
    aspect: true,
    transformSize: options.transformSize ?? (value => `${value}px`),
  }),

})
