import { useEventListener } from '@reactive-drag/shared'
import type { MaybeRefOrGetter } from 'vue'
import { ref } from 'vue'

interface UseHoverElementOptions {
  proxyTarget?: MaybeRefOrGetter<HTMLElement | null | undefined | Document>
  trigger?: 'hover' | 'click'
}
export function useActiveElement(options: UseHoverElementOptions = {}) {
  const { proxyTarget = document, trigger = 'click' } = options
  const elementRef = ref<HTMLElement>()

  function getElement(event: MouseEvent) {
    elementRef.value = event.target as HTMLElement
  }

  if (trigger === 'click') {
    useEventListener(proxyTarget, 'click', getElement)
  }
  else if (trigger === 'hover') {
    useEventListener(proxyTarget, 'mousemove', getElement)
  }

  return elementRef
}
