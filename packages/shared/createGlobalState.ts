import { effectScope, onScopeDispose } from 'vue'

type AnyFn = (...args: any[]) => any

export function createGlobalState<Fn extends AnyFn>(stateFactory: Fn): Fn {
  const scope = effectScope(true)
  let initialized = false
  let state: any

  onScopeDispose(scope.stop)

  return ((...args: any[]) => {
    if (initialized) {
      // 初始化过了
      return state
    }

    state = scope.run(() => stateFactory(...args))
    initialized = true
    return state
  }) as Fn
}
