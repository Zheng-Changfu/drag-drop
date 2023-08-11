import { effectScope, onScopeDispose } from 'vue'

export function createGlobalState<T extends (...args: any[]) => any>(stateFactory: T) {
  const scope = effectScope(true)
  let initialized = false
  let state: any

  onScopeDispose(scope.stop)

  return (...args: any[]) => {
    if (initialized) {
      // 初始化过了
      return state
    }

    state = scope.run(() => stateFactory(...args))
    initialized = true
  }
}
export type CreateGlobalStateReturn = ReturnType<typeof createGlobalState>
