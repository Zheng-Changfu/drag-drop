import type { DragDropPluginCtx, MouseEventParams } from '@drag-drop/core'
import { isFunc } from '@drag-drop/shared'
import { ref, toValue, unref } from 'vue'
import type { CSSProperties, MaybeRefOrGetter, VNodeChild } from 'vue'

interface MouseFollowPluginOptions {
  style?: MaybeRefOrGetter<CSSProperties>
  text?: string | ((params: MouseEventParams | undefined) => string)
  custom?: (params: MouseEventParams | undefined) => VNodeChild
  onDragging?: (params: MouseEventParams) => void
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
    const mouseDownParamsRef = ref<MouseEventParams>()
    const positionRef = ref<{ x: number; y: number }>({ x: 0, y: 0 })

    function getText() {
      return isFunc(text) ? text(unref(mouseDownParamsRef)) : text
    }

    function updatePosition() {
      context.onDragging((params) => {
        positionRef.value.x = params.event.x
        positionRef.value.y = params.event.y
        onDragging?.(params)
      })
    }

    function updateMouseDownParams() {
      context.onStart(params => mouseDownParamsRef.value = params)
      context.onEnd(() => mouseDownParamsRef.value = undefined)
    }

    updatePosition()
    updateMouseDownParams()

    return () => {
      const { x, y } = unref(positionRef)
      const isDragging = unref(isDraggingRef)
      const mouseDownParams = unref(mouseDownParamsRef)

      if (isFunc(custom)) {
        return <div v-show={isDragging}>
          {custom(mouseDownParams)}
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
