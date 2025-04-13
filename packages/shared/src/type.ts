/**
 * A number or a string that can be converted to a number.
 */
export type NumberString = number | string

/**
 * A percentage string.
 */
export type Percentage = `${number}%` | (string & {})

export interface Size {
  width: number
  height: number
}

/**
 * A size with unit.
 *
 * @example
 * ```ts
 * const size: UnitSize = {
 *   width: '100px',
 *   height: '100px',
 * }
 * ```
 */
export interface UnitSize {
  width: `${number}${string}` | (string & {})
  height: `${number}${string}` | (string & {})
}
