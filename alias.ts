import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function r(p: string) {
  return resolve(fileURLToPath(new URL('.', import.meta.url)), p)
}

export const alias = {
  '@autobg/shared': r('./packages/shared/src'),
}
