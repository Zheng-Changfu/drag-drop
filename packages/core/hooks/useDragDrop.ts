import { type MaybeRefOrGetter, computed, ref, toValue, unref } from 'vue'
import { createEventHook, isBool, isFunc, isIframeTag, useEventListener } from '@drag-drop/shared'
import type { DragDropPlugin, EnhancedMouseEvent, Frame, UseDragDropContext } from '../types'
import { castEnhancedMouseEvent } from '../helpers/castEnhancedMouseEvent'
import { use } from '../helpers/plugin'

interface UseDragDropOptions {
  frames?: Array<MaybeRefOrGetter<HTMLIFrameElement | undefined>>
  canDropable?: boolean | ((event: EnhancedMouseEvent) => boolean)
  canDraggable?: boolean | ((event: EnhancedMouseEvent) => boolean)
}
export function useDragDrop(options: UseDragDropOptions = {}): UseDragDropContext {
  const {
    frames,
    canDropable,
    canDraggable,
  } = options

  const frameList: Frame[] = []
  const isDraggingRef = ref(false)
  const canDraggableRef = ref(true)
  const canDropableRef = ref(true)

  const { on: onEnd, trigger: dispatchEndEvent } = createEventHook<EnhancedMouseEvent>()
  const { on: onMove, trigger: dispatchMoveEvent } = createEventHook<EnhancedMouseEvent>()
  const { on: onStart, trigger: dispatchStartEvent } = createEventHook<EnhancedMouseEvent>()
  const { on: onDragging, trigger: dispatchDraggingEvent } = createEventHook<EnhancedMouseEvent>()

  function getCanDraggable(event: EnhancedMouseEvent) {
    if (isBool(canDraggable) && canDraggable === false) {
      return false
    }
    if (isFunc(canDraggable) && canDraggable(event) === false) {
      return false
    }
    return true
  }

  function getCanDropable(event: EnhancedMouseEvent) {
    if (isBool(canDropable) && canDropable === false) {
      return false
    }
    if (isFunc(canDropable) && canDropable(event) === false) {
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
    dispatchStartEvent(evt)
    dispatchDraggingEvent(evt)
  }

  function handleMouseMove(event: MouseEvent, iframe?: HTMLIFrameElement) {
    if (!unref(isDraggingRef)) return
    const evt = castEnhancedMouseEvent(event, iframe)
    const canDropable = getCanDropable(evt)
    canDropableRef.value = canDropable
    dispatchMoveEvent(evt)
    dispatchDraggingEvent(evt)
  }

  function handleMouseUp(event: MouseEvent, iframe?: HTMLIFrameElement) {
    if (!unref(isDraggingRef)) return
    const evt = castEnhancedMouseEvent(event, iframe)
    const canDropable = getCanDropable(evt)
    canDropableRef.value = canDropable
    isDraggingRef.value = false
    dispatchEndEvent(evt)
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

  function useFrameList() {
    return frameList
  }

  useEventListener(document, 'mousedown', handleMouseDown)
  useEventListener(document, 'mousemove', handleMouseMove)
  useEventListener(document, 'mouseup', handleMouseUp)

  if (frames) {
    frames.forEach((frame) => {
      const iframeGetter = computed(() => {
        const el = toValue(frame)
        if (isIframeTag(el)) {
          return el
        }
        return null
      })

      const iframeDocumentGetter = computed(() => {
        const iframe = unref(iframeGetter)
        if (iframe) {
          return iframe.contentDocument
        }
        return null
      })

      useEventListener(iframeDocumentGetter, 'mousedown', event => handleMouseDown(event, unref(iframeGetter)!))
      useEventListener(iframeDocumentGetter, 'mousemove', event => handleMouseMove(event, unref(iframeGetter)!))
      useEventListener(iframeDocumentGetter, 'mouseup', event => handleMouseUp(event, unref(iframeGetter)!))

      frameList.push({
        iframeGetter,
        iframeDocumentGetter,
      })
    })
  }

  const context: UseDragDropContext = {
    onEnd,
    onMove,
    onStart,
    onDragging,
    useDragging,
    useFrameList,
    useCanDropable,
    useCanDraggable,
    castEnhancedMouseEvent,
    use(plugin: DragDropPlugin) {
      return use(context, plugin)!
    },
  }

  return context
}
