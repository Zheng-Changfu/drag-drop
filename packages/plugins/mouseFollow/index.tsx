import type { DragDropPluginCtx, DrapDropEventsCallback, EnhancedMouseEvent, MaybeBoolOrFunc } from '@drag-drop/core'
import { isBool, isFunc } from '@drag-drop/shared'
import { ref, unref } from 'vue'
import type { CSSProperties, VNodeChild } from 'vue'

interface Position {
  x: number
  y: number
}

function buildInRender(event: EnhancedMouseEvent, style: CSSProperties) {
  return <div style={{
    ...style,
    color: '#fff',
    padding: '4px 8px',
    background: '#0000f6',
  }}>{event.target?.textContent ?? '默认文本'}</div>
}

interface MouseFollowPluginOptions {
  onEnd?: DrapDropEventsCallback['onEnd']
  onStart?: DrapDropEventsCallback['onStart']
  onDragging?: DrapDropEventsCallback['onDragging']
  canDraggable?: MaybeBoolOrFunc<(event: EnhancedMouseEvent) => boolean>
  onRender?: (event: EnhancedMouseEvent, style: CSSProperties) => VNodeChild
}

export function mouseFollowPlugin(options: MouseFollowPluginOptions) {
  return function ({ context }: DragDropPluginCtx) {
    const {
      onEnd,
      onStart,
      onDragging,
      canDraggable,
      onRender = buildInRender,
    } = options

    const isDraggingRef = context.useDragging()
    const positionRef = ref<Position>({ x: 0, y: 0 })
    const mouseDownEventRef = ref<EnhancedMouseEvent>()

    function getCanDraggable(event: EnhancedMouseEvent, canDraggable: MouseFollowPluginOptions['canDraggable']) {
      if (isBool(canDraggable) && canDraggable === false) {
        return false
      }
      if (isFunc(canDraggable) && canDraggable(event) === false) {
        return false
      }
      return true
    }

    context.onStart((event) => {
      if (!getCanDraggable(event, canDraggable)) return
      mouseDownEventRef.value = event
      onStart?.(event)
    })

    context.onDragging((event) => {
      positionRef.value.x = event.x
      positionRef.value.y = event.y
      onDragging?.(event)
    })

    context.onEnd((event) => {
      mouseDownEventRef.value = undefined
      onEnd?.(event)
    })

    return () => {
      const { x, y } = unref(positionRef)
      const isDragging = unref(isDraggingRef)
      const mouseDownEvent = unref(mouseDownEventRef)

      if (!isDragging || !mouseDownEvent) return null

      return onRender(mouseDownEvent, {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 'auto',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      })
    }
  }
}
