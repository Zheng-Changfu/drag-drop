import { getCurrentScope, onScopeDispose } from 'vue'
import type { AnyFn } from '@vueuse/core'

// 防止 scope 不存在,vue 会报警告
export function tryOnScopeDispose(fn: AnyFn) {
  const scope = getCurrentScope()

  if (scope) {
    onScopeDispose(fn)
  }
}
