import type { DragDropPluginCtx, EnhancedMouseEvent } from '@drag-drop/core'
import { ref } from 'vue'

interface SortPluginOptions {
  swap: (mouseDownEvent: EnhancedMouseEvent, mouseMoveEvent: EnhancedMouseEvent) => void
}
export function sortPlugin(options: SortPluginOptions) {
  return function ({ context }: DragDropPluginCtx) {
    const { swap } = options
    const mouseDownEventRef = ref()

    context.onStart((event) => {

    })
  }
}
