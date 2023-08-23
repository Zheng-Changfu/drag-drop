import type { CanDropableFn, DragDropPluginCtx, DrapDropEventsCallback } from '@drag-drop/core'
import type { AnyFn } from '@drag-drop/shared'
import { getBoundingClientRect, isBool, isHtmlElement, isNumber, noop } from '@drag-drop/shared'
import { onScopeDispose, ref, toValue, unref, watch } from 'vue'
import type { CSSProperties, MaybeRefOrGetter } from 'vue'

interface BoundingRect {
  left: number
  top: number
  width: number
  height: number
}

interface TriggerFn {
  (hide: false): void
  (x: number, y: number): void
  (element: HTMLElement): void
}

interface OutlinePluginOptions {
  draggingEnable?: boolean
  canDropable?: CanDropableFn
  style?: MaybeRefOrGetter<CSSProperties>
  onDragging?: DrapDropEventsCallback['onDragging']
}

export function outlinePlugin(options: OutlinePluginOptions = {}) {
  return function ({ context, expose }: DragDropPluginCtx) {
    const {
      style = {},
      onDragging,
      canDropable,
      draggingEnable = true,
    } = options

    const boundingRectRef = ref<BoundingRect>()
    const canDropableRef = context.useCanDropable(canDropable)

    function updateBoundingRect(val?: BoundingRect) {
      boundingRectRef.value = val
    }

    const trigger: TriggerFn = (val: number | HTMLElement | false, y?: number) => {
      if (!unref(canDropableRef)) {
        updateBoundingRect()
        return
      }

      if (isBool(val)) {
        // hide
        updateBoundingRect()
        return
      }

      let el: HTMLElement | undefined
      if (isNumber(val)) {
        // trigger
        if (!isNumber(y)) {
          console.warn('y expect a number')
          y = 0
        }
        const element = document.elementFromPoint(val, y)
        if (element) {
          el = element as HTMLElement
        }
      }

      if (isHtmlElement(val)) {
        el = val
      }

      if (!el) {
        updateBoundingRect()
        return
      }

      updateBoundingRect(getBoundingClientRect(el))
    }

    let stop = noop as AnyFn

    if (draggingEnable) {
      context.onDragging((event) => {
        trigger(event.x, event.y)
        onDragging?.(event)
      })
      stop = watch(context.useDragging(), (isDragging) => {
        if (isDragging === false) {
          trigger(false)
        }
      })
    }

    onScopeDispose(stop)
    expose({ trigger })

    return () => {
      const boundingRect = unref(boundingRectRef)
      if (!boundingRect) {
        return null
      }
      const { left, top, width, height } = boundingRect

      return <div
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

export interface OutlinePluginExposed {
  trigger: TriggerFn
}
