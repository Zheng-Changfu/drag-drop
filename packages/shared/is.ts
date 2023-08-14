export type AnyFn = (...args: any[]) => any
export const isBool = (val: any): val is boolean => typeof val === 'boolean'
export const isFunc = (val: any): val is AnyFn => typeof val === 'function'
