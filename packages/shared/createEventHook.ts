import { getCurrentScope } from 'vue'

export type EventHookOn<T = any> = (fn: (param: T) => void) => { off: () => void }
export type EventHookOff<T = any> = (fn: (param: T) => void) => void
export type EventHookTrigger<T = any> = (param: T) => Promise<unknown[]>

export interface EventHook<T = any> {
  on: EventHookOn<T>
  off: EventHookOff<T>
  trigger: EventHookTrigger<T>
}

export function createEventHook<T = any>(): EventHook<T> {
  const fns: Set<(param: T) => void> = new Set()
  const scope = getCurrentScope()

  const off = (fn: (param: T) => void) => {
    fns.delete(fn)
  }

  const on = (fn: (param: T) => void) => {
    fns.add(fn)
    const offFn = () => off(fn)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    scope.cleanups.push(offFn)

    return {
      off: offFn,
    }
  }

  const trigger = (param: T) => {
    return Promise.all(Array.from(fns).map(fn => fn(param)))
  }

  return {
    on,
    off,
    trigger,
  }
}
