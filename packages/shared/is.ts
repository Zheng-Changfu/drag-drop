export type AnyFn = (...args: any[]) => any
export const isBool = (val: any): val is boolean => typeof val === 'boolean'
export const isFunc = (val: any): val is AnyFn => typeof val === 'function'
export const isArray = Array.isArray
export const isString = (val: any): val is string => typeof val === 'string'
export const isIframeTag = (val: HTMLElement | HTMLIFrameElement | undefined): val is HTMLIFrameElement => val?.tagName === 'IFRAME'
