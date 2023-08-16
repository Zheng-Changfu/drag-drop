// import { createGlobalState } from '@drag-drop/shared'
import { ref } from 'vue'

export function useDragging() {
  const isDraggingRef = ref(false)
  const setDragging = (dragging: boolean) => isDraggingRef.value = dragging

  return {
    isDragging: isDraggingRef,
    setDragging,
  }
}
