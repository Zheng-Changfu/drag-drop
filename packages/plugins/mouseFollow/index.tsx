import type { DragDropPluginCtx, EnhancedMouseEvent } from '@drag-drop/core'
import { isFunc } from '@drag-drop/shared'
import { ref, toValue, unref } from 'vue'
import type { CSSProperties, MaybeRefOrGetter, VNodeChild } from 'vue'

interface MouseFollowPluginOptions {
  style?: MaybeRefOrGetter<CSSProperties>
  text?: string | ((event: EnhancedMouseEvent | undefined) => string)
  custom?: (event: EnhancedMouseEvent | undefined) => VNodeChild
  onDragging?: (event: EnhancedMouseEvent) => void
}

export function mouseFollowPlugin(options: MouseFollowPluginOptions = {}) {
  return function ({ context }: DragDropPluginCtx) {
    const {
      custom,
      onDragging,
      style = {},
      text = '默认文本',
    } = options

    const isDraggingRef = context.useDragging()
    const mouseDownEventRef = ref<EnhancedMouseEvent>()
    const positionRef = ref<{ x: number; y: number }>({ x: 0, y: 0 })

    function getText() {
      return isFunc(text) ? text(unref(mouseDownEventRef)) : text
    }

    function updatePosition() {
      context.onDragging((event) => {
        positionRef.value.x = event.x
        positionRef.value.y = event.y
        onDragging?.(event)
      })
    }

    function updateMouseDownParams() {
      context.onStart(event => mouseDownEventRef.value = event)
      context.onEnd(() => mouseDownEventRef.value = undefined)
    }

    updatePosition()
    updateMouseDownParams()

    return () => {
      const { x, y } = unref(positionRef)
      const isDragging = unref(isDraggingRef)
      const mouseDownEvent = unref(mouseDownEventRef)

      if (isFunc(custom)) {
        return <div v-show={isDragging}>
          {custom(mouseDownEvent)}
        </div>
      }

      return <div
        v-show={isDragging}
        style={{
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
          zIndex: 1,
          color: '#fff',
          padding: '4px 8px',
          background: '#0000f6',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          ...toValue(style),
        }}>
        {getText()}
      </div>
    }
  }
}
