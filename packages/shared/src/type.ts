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

export type TransformSize = (value: number) => string | number
