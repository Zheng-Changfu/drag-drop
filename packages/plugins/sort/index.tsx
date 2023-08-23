import { ref, unref } from 'vue'
import type { DragDropPluginCtx, DrapDropEventsCallback, EnhancedMouseEvent, MaybeBoolOrFunc } from '@drag-drop/core'
import { isBool, isFunc } from '@drag-drop/shared'

interface SortPluginOptions {
  sort: (mouseDownEvent: EnhancedMouseEvent, mouseMoveEvent: EnhancedMouseEvent) => void
  onEnd?: DrapDropEventsCallback['onEnd']
  onMove?: DrapDropEventsCallback['onMove']
  onStart?: DrapDropEventsCallback['onStart']
  canDraggable?: MaybeBoolOrFunc<(event: EnhancedMouseEvent) => boolean>
}
export function sortPlugin(options: SortPluginOptions) {
  return function ({ context }: DragDropPluginCtx) {
    const {
      sort,
      onStart,
      onMove,
      onEnd,
      canDraggable,
    } = options
    const mouseDownEventRef = ref<EnhancedMouseEvent>()
    const mouseMoveEventRef = ref<EnhancedMouseEvent>()

    function getCanDraggable(event: EnhancedMouseEvent, canDraggable: SortPluginOptions['canDraggable']) {
      if (isBool(canDraggable) && canDraggable === false) {
        return false
      }
      if (isFunc(canDraggable) && canDraggable(event) === false) {
        return false
      }
      return true
    }

    context.onStart((event) => {
      if (!getCanDraggable(event, canDraggable)) {
        return
      }
      mouseDownEventRef.value = event
      onStart?.(event)
    })

    context.onMove((event) => {
      const mouseDownEvent = unref(mouseDownEventRef)
      mouseMoveEventRef.value = event
      mouseDownEvent && sort(mouseDownEvent, event)
      onMove?.(event)
    })

    context.onEnd((event) => {
      mouseDownEventRef.value = undefined
      mouseMoveEventRef.value = undefined
      onEnd?.(event)
    })
  }
}
