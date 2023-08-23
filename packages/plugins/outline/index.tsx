import type { DragDropPluginCtx, DrapDropEventsCallback, MaybeBoolOrFunc } from '@drag-drop/core'
import type { AnyFn } from '@drag-drop/shared'
import { getBoundingClientRect, isBool, isFunc, isHtmlElement, isNumber, noop } from '@drag-drop/shared'
import type { CSSProperties, VNodeChild } from 'vue'
import { onScopeDispose, ref, unref, watch } from 'vue'

type BoundingRect = Omit<DOMRect, 'toJSON'>

interface TriggerFn {
  (hide: false): void
  (x: number, y: number): void
  (element: HTMLElement): void
}

function buildInRender(rect: BoundingRect, style: CSSProperties) {
  return <div style={{
    ...style,
    outline: 'dashed 1px #0071e7',
    background: 'rgba(0, 0, 0, 0.1)',
  }}></div>
}

interface OutlinePluginOptions {
  draggingEnable?: boolean
  onRender?: (rect: BoundingRect) => VNodeChild
  onDragging?: DrapDropEventsCallback['onDragging']
  showOutline?: MaybeBoolOrFunc<(rect: BoundingRect) => boolean>
}

export function outlinePlugin(options: OutlinePluginOptions = {}) {
  return function ({ context, expose }: DragDropPluginCtx) {
    const {
      onDragging,
      showOutline = true,
      draggingEnable = true,
      onRender = buildInRender,
    } = options

    const isDraggingRef = context.useDragging()
    const boundingRectRef = ref<BoundingRect>()

    function getCanShowOutline() {
      const rect = unref(boundingRectRef)
      if (!rect) {
        return false
      }
      if (isBool(showOutline)) {
        return showOutline
      }
      if (isFunc(showOutline)) {
        return showOutline(rect)
      }
      return true
    }

    const trigger: TriggerFn = (val: number | HTMLElement | false, y?: number) => {
      if (isBool(val)) {
        // hide
        boundingRectRef.value = undefined
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
        boundingRectRef.value = undefined
        return
      }

      boundingRectRef.value = getBoundingClientRect(el)
    }

    let stop = noop as AnyFn

    if (draggingEnable) {
      context.onDragging((event) => {
        trigger(event.x, event.y)
        onDragging?.(event)
      })

      stop = watch(isDraggingRef, (isDragging) => {
        if (isDragging === false) {
          trigger(false)
        }
      })
    }

    onScopeDispose(stop)
    expose({ trigger })

    return () => {
      const boundingRect = unref(boundingRectRef)
      const showOutline = getCanShowOutline()

      if (!boundingRect || !showOutline) {
        return null
      }

      const { left, top, width, height } = boundingRect

      return onRender(boundingRect, {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: 'none',
        zIndex: 'auto',
        transition: 'width 0.1s ease-in,height 0.1s ease-in,left 0.1s ease-in,top 0.1s ease-in',
      })
    }
  }
}

export interface OutlinePluginExposed {
  trigger: TriggerFn
}
