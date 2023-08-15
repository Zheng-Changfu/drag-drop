import type { UseReactionDragContext } from '@reactive-drag/core'
import { isBool, isFunc } from '@reactive-drag/shared'
import { computed, ref, toValue, unref } from 'vue'
import type { CSSProperties, MaybeRefOrGetter } from 'vue'

interface OutlinePluginOptions {
  style?: MaybeRefOrGetter<CSSProperties>
  canDropable?: boolean | ((element: HTMLElement) => boolean)
}

interface Position {
  x: number
  y: number
}

export function outlinePlugin(options: OutlinePluginOptions = {}) {
  return function (dragContext: UseReactionDragContext) {
    const { style = {}, canDropable = true } = options
    const { onDragging, isDragging } = dragContext
    const positionRef = ref<Position>({ x: 0, y: 0 })

    function syncPosition(event: MouseEvent) {
      positionRef.value.x = event.clientX
      positionRef.value.y = event.clientY
    }

    function getCanDropable(element: HTMLElement) {
      if (isBool(canDropable) && canDropable === false) {
        return false
      }
      if (isFunc(canDropable) && canDropable(element) === false) {
        return false
      }
      return true
    }

    const computedBoundingRect = computed(() => {
      const { x, y } = positionRef.value
      const element = document.elementFromPoint(x, y)
      if (element && getCanDropable(element as any)) {
        return element.getBoundingClientRect()
      }
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      }
    })

    onDragging(syncPosition)
    // TODO: mousemove

    return () => {
      const { left, top, width, height } = unref(computedBoundingRect)

      return <div
       v-show={isDragging()}
       style={{
         position: 'fixed',
         left: `${left}px`,
         top: `${top}px`,
         width: `${width}px`,
         height: `${height}px`,
         pointerEvents: 'none',
         zIndex: 'auto',
         transition: 'width 0.1s ease-in,height 0.1s ease-in,left 0.1s ease-in,top 0.1s ease-in',
         outline: 'dashed 1px #0071e7',
         background: 'rgba(0, 0, 0, 0.1)',
         ...toValue(style),
       }}></div>
    }
  }
}
