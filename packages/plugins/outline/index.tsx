import type { DragDropPluginCtx, DrapDropEventsCallback, MaybeBoolOrFunc } from '@drag-drop/core'
import type { AnyFn } from '@drag-drop/shared'
import { getBoundingClientRect, isBool, isFunc, isHtmlElement, isNumber, noop, useEventListener } from '@drag-drop/shared'
import type { CSSProperties, VNodeChild } from 'vue'
import { onScopeDispose, ref, unref, watch } from 'vue'

type Rect = Omit<DOMRect, 'toJSON'> & { element: HTMLElement }

interface TriggerFn {
  (hide: false): void
  (x: number, y: number): void
  (element: HTMLElement): void
}

function buildInRender(rect: Rect, style: CSSProperties) {
  return <div class="aaaa" style={{
    ...style,
    outline: 'solid 1px #388bfe',
    background: 'rgba(0, 0, 0, 0.1)',
  }}></div>
}

interface OutlinePluginOptions {
  hoverEnable?: boolean
  draggingEnable?: boolean
  resizeCorrected?: boolean
  scrollCorrected?: boolean
  onRender?: (rect: Rect) => VNodeChild
  onDragging?: DrapDropEventsCallback['onDragging']
  showOutline?: MaybeBoolOrFunc<(rect: Rect) => boolean>
}

export function outlinePlugin(options: OutlinePluginOptions = {}) {
  return function ({ context, expose }: DragDropPluginCtx) {
    const {
      onDragging,
      showOutline = true,
      hoverEnable = true,
      draggingEnable = true,
      resizeCorrected = true,
      scrollCorrected = true,
      onRender = buildInRender,
    } = options

    const rectRef = ref<Rect>()
    const frameList = context.useFrameList()
    const isDraggingRef = context.useDragging()

    function getCanShowOutline() {
      const rect = unref(rectRef)
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
        rectRef.value = undefined
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
        rectRef.value = undefined
        return
      }

      const { x, y: _y, width, height, left, right, top, bottom } = getBoundingClientRect(el)
      rectRef.value = {
        x,
        y: _y,
        width,
        height,
        left,
        right,
        top,
        bottom,
        element: el,
      }
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

    if (hoverEnable) {
      function mouseMoveHandler(event: MouseEvent) {
        if (unref(isDraggingRef)) return
        const evt = context.castEnhancedMouseEvent(event)
        trigger(evt.x, evt.y)
      }

      useEventListener(document, 'mousemove', mouseMoveHandler)
      frameList.forEach(({ iframeDocumentGetter }) => useEventListener(iframeDocumentGetter, 'mousemove', mouseMoveHandler))
    }

    function correctionRect() {
      const rect = unref(rectRef)
      if (!rect) return
      trigger(rect.element)
    }

    if (resizeCorrected) {
      useEventListener(window, 'resize', correctionRect)
      frameList.forEach(({ iframeWindowGetter }) => useEventListener(iframeWindowGetter, 'resize', correctionRect))
    }

    if (scrollCorrected) {
      useEventListener(document, 'scroll', correctionRect)
      frameList.forEach(({ iframeDocumentGetter }) => useEventListener(iframeDocumentGetter, 'scroll', correctionRect))
    }

    onScopeDispose(stop)
    expose({ trigger })

    return () => {
      const rect = unref(rectRef)
      const showOutline = getCanShowOutline()

      if (!rect || !showOutline) {
        return null
      }

      const { left, top, width, height } = rect

      return onRender(rect, {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: 'none',
        zIndex: 'auto',
        transition: 'all 0.1s ease-in',
      })
    }
  }
}

export interface OutlinePluginExposed {
  trigger: TriggerFn
}
