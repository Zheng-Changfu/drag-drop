import { createEventHook, useEventListener } from '@drag-drop/shared'
import type { Ref } from 'vue'
import { computed, ref, unref, watch } from 'vue'

interface EnhancedMouseEvent {
  x: number
  y: number
  pageX: number
  pageY: number
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  screenX: number
  screenY: number
  target: HTMLElement | null | undefined
  originEvent: MouseEvent
}

interface UseMouseDownOptions {
  isDragging: Ref<boolean>
}

export function useMouseDown(options: UseMouseDownOptions) {
  const { isDragging } = options
  const { on, trigger } = createEventHook()
  const enhancedMouseEventRef = ref<EnhancedMouseEvent>()

  function handleMouseDown(event: MouseEvent) {
    trigger('1')
  }

  watch(isDragging, () => {
    if (unref(isDragging) === false) {
      enhancedMouseEventRef.value = undefined
    }
  })

  useEventListener(document, 'mousedown', handleMouseDown)

  return {
    onStart: on,
    event: enhancedMouseEventRef,
    element: computed(() => unref(enhancedMouseEventRef)?.target),
  }
}
