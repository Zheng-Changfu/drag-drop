import { ref, unref } from 'vue'
import type { DragDropPluginCtx, DrapDropEventsCallback, EnhancedMouseEvent } from '@drag-drop/core'

interface SortPluginOptions extends Partial<Omit<DrapDropEventsCallback, 'onDragging'>> {
  swap: (mouseDownEvent: EnhancedMouseEvent, mouseMoveEvent: EnhancedMouseEvent) => void
}
export function sortPlugin(options: SortPluginOptions) {
  return function ({ context }: DragDropPluginCtx) {
    const {
      swap,
      onStart,
      onMove,
      onEnd,
    } = options
    const mouseDownEventRef = ref<EnhancedMouseEvent>()
    const mouseMoveEventRef = ref<EnhancedMouseEvent>()

    context.onStart((event) => {
      mouseDownEventRef.value = event
      onStart?.(event)
    })

    context.onMove((event) => {
      mouseMoveEventRef.value = event
      swap(unref(mouseDownEventRef)!, event)
      onMove?.(event)
    })

    context.onEnd((event) => {
      mouseDownEventRef.value = undefined
      mouseMoveEventRef.value = undefined
      onEnd?.(event)
    })
  }
}
