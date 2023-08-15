import type { UseReactionDragContext } from '@reactive-drag/core'
import { isFunc } from '@reactive-drag/shared'
import { ref, toValue, unref } from 'vue'
import type { CSSProperties, MaybeRefOrGetter, VNodeChild } from 'vue'

interface FuncParams {
  x: number
  y: number
  element: HTMLElement | undefined
  event: MouseEvent
}

interface MouseFollowPluginOptions {
  style?: MaybeRefOrGetter<CSSProperties>
  onDragging?: (params: FuncParams) => void
  text?: string | ((params: Omit<FuncParams, 'event'>) => string)
  customElement?: (params: Omit<FuncParams, 'event'>) => VNodeChild
}

type Position = Pick<FuncParams, 'x' | 'y'>

export function mouseFollowPlugin(options: MouseFollowPluginOptions = {}) {
  return function (dragContext: UseReactionDragContext) {
    const { customElement, style = {}, onDragging, text = '' } = options
    const { useDragElement, onDragging: _onDragging, isDragging } = dragContext
    const positionRef = ref<Position>({ x: 0, y: 0 })
    const dragElementRef = useDragElement()

    _onDragging((event) => {
      const x = event.clientX
      const y = event.clientY
      positionRef.value.x = x
      positionRef.value.y = y
      onDragging?.({
        x,
        y,
        event,
        element: unref(dragElementRef),
      })
    })

    function getText() {
      const { x, y } = unref(positionRef)
      const element = unref(dragElementRef)
      if (isFunc(text)) {
        return text({ x, y, element })
      }
      return text
    }

    return () => {
      const { x, y } = unref(positionRef)
      const element = unref(dragElementRef)

      if (isFunc(customElement)) {
        return <div v-show={ isDragging() }>{ customElement({ x, y, element }) }</div>
      }

      return <div v-show={ isDragging() } style={{
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
        { getText() }
      </div>
    }
  }
}
