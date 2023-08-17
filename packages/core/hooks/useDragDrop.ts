import { type MaybeRefOrGetter, onScopeDispose, ref, toValue, unref, watch } from 'vue'
import type { AnyFn } from '@drag-drop/shared'
import { createEventHook, isBool, isFunc, isIframeTag, noop, useEventListener } from '@drag-drop/shared'
import type { DragDropPlugin, EnhancedMouseEvent, MouseEventParams, NullUndefinedAble, UseDragDropContext } from '../types'
import { castEnhancedMouseEvent } from '../helpers/castEnhancedMouseEvent'
import { use } from '../helpers/plugin'

interface UseDragDropOptions {
  frames?: Array<MaybeRefOrGetter<HTMLIFrameElement | undefined>>
  canDropable?: boolean | ((element: NullUndefinedAble<HTMLElement>, event: EnhancedMouseEvent) => boolean)
  canDraggable?: boolean | ((element: NullUndefinedAble<HTMLElement>, event: EnhancedMouseEvent) => boolean)
}
export function useDragDrop(options: UseDragDropOptions = {}): UseDragDropContext {
  const {
    frames,
    canDropable,
    canDraggable,
  } = options
  const isDraggingRef = ref(false)
  const canDraggableRef = ref(true)
  const canDropableRef = ref(true)
  const { on: onStart, trigger: dispatchStartEvent } = createEventHook<MouseEventParams>()
  const { on: onMove, trigger: dispatchMoveEvent } = createEventHook<MouseEventParams>()
  const { on: onEnd, trigger: dispatchEndEvent } = createEventHook<MouseEventParams>()
  const { on: onDragging, trigger: dispatchDraggingEvent } = createEventHook<MouseEventParams>()

  function getCanDraggable(event: EnhancedMouseEvent) {
    if (isBool(canDraggable) && canDraggable === false) {
      return false
    }
    if (isFunc(canDraggable) && canDraggable(event.target, event) === false) {
      return false
    }
    return true
  }

  function getCanDropable(event: EnhancedMouseEvent) {
    if (isBool(canDropable) && canDropable === false) {
      return false
    }
    if (isFunc(canDropable) && canDropable(event.target, event) === false) {
      return false
    }
    return true
  }

  function handleMouseDown(event: MouseEvent, iframe?: HTMLIFrameElement) {
    const evt = castEnhancedMouseEvent(event, iframe)
    const canDraggable = getCanDraggable(evt)
    canDraggableRef.value = canDraggable
    if (!canDraggable) return
    isDraggingRef.value = true

    const payload = {
      event: evt,
      target: evt.target,
      inIframe: !!iframe,
    }
    dispatchStartEvent(payload)
    dispatchDraggingEvent(payload)
  }

  function handleMouseMove(event: MouseEvent, iframe?: HTMLIFrameElement) {
    if (!unref(isDraggingRef)) return
    const evt = castEnhancedMouseEvent(event, iframe)

    const payload = {
      event: evt,
      target: evt.target,
      inIframe: !!iframe,
    }
    dispatchMoveEvent(payload)
    dispatchDraggingEvent(payload)
  }

  function handleMouseUp(event: MouseEvent, iframe?: HTMLIFrameElement) {
    if (!unref(isDraggingRef)) return
    const evt = castEnhancedMouseEvent(event, iframe)
    const canDropable = getCanDropable(evt)
    canDropableRef.value = canDropable
    isDraggingRef.value = false

    const payload = {
      event: evt,
      target: evt.target,
      inIframe: !!iframe,
    }
    dispatchEndEvent(payload)
  }

  function useCanDropable() {
    return canDropableRef
  }

  function useCanDraggable() {
    return canDraggableRef
  }

  function useDragging() {
    return isDraggingRef
  }

  useEventListener(document, 'mousedown', handleMouseDown)
  useEventListener(document, 'mousemove', handleMouseMove)
  useEventListener(document, 'mouseup', handleMouseUp)

  let stop = noop as AnyFn

  if (frames) {
    stop = watch(frames, (vals) => {
      vals.forEach((val) => {
        const el = toValue(val)
        if (isIframeTag(el)) {
          const iframeDocument = el.contentDocument
          if (iframeDocument) {
            useEventListener(iframeDocument, 'mousedown', event => handleMouseDown(event, el))
            useEventListener(iframeDocument, 'mousemove', event => handleMouseMove(event, el))
            useEventListener(iframeDocument, 'mouseup', event => handleMouseUp(event, el))
          }
        }
      })
    }, { flush: 'post' })
  }

  const context: UseDragDropContext = {
    onEnd,
    onMove,
    onStart,
    onDragging,
    useDragging,
    useCanDropable,
    useCanDraggable,
    use(plugin: DragDropPlugin) {
      return use(context, plugin)!
    },
  }

  onScopeDispose(stop)

  return context
}
