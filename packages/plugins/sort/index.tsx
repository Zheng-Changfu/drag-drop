import { ref, unref } from 'vue'
import type { DragDropPluginCtx, DrapDropEventsCallback, EnhancedMouseEvent } from '@drag-drop/core'

interface SortPluginOptions extends Partial<Omit<DrapDropEventsCallback, 'onDragging'>> {
  swap: (mouseDownEvent: EnhancedMouseEvent, mouseMoveEvent: EnhancedMouseEvent) => void
}
export function sortPlugin(options: SortPluginOptions) {
  return function ({ context, expose }: DragDropPluginCtx) {
    const {
      swap,
      onStart,
      onMove,
      onEnd,
    } = options
    const mouseDownEventRef = ref<EnhancedMouseEvent>()
    const mouseMoveEventRef = ref<EnhancedMouseEvent>()

    // 数据源变换，会重新渲染 DOM,可能会导致 mouseDownEventRef 不正确,所以这里可以让用户手动同步
    function updateMouseDownEvent() {
      if (unref(mouseDownEventRef) && unref(mouseMoveEventRef)) {
        mouseDownEventRef.value = { ...unref(mouseMoveEventRef)! }
      }
    }

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

    expose({ updateMouseDownEvent })
  }
}

export interface SortPluginExposedData {
  updateMouseDownEvent: () => void
}
