import { ref } from 'vue'
import type { UseReactionDragContext } from './types'

export function useDragElement(context: UseReactionDragContext) {
  const elementRef = ref<HTMLElement>()

  context.onStart((event) => {
    elementRef.value = event.target as HTMLElement
  })

  context.onEnd(() => {
    elementRef.value = undefined
  })

  return elementRef
}
