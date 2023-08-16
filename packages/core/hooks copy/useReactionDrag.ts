import { isBool, isFunc, useEventListener } from '@reactive-drag/shared'
import type { MaybeRefOrGetter } from 'vue'
import { ref, unref } from 'vue'
import { useEventHook } from './useEventHook'
import { usePluginContext } from './usePluginContext'
import type { Plugin, UseReactionDragContext } from './types'
import { useDragElement } from './useDragElement'

interface UseReactionDragOptions {
  proxyTarget?: MaybeRefOrGetter<HTMLElement | null | undefined | Document>
  canDraggable?: boolean | ((element: HTMLElement, event: MouseEvent) => boolean)
}
export function useReactionDrag(options: UseReactionDragOptions = {}) {
  const {
    proxyTarget = document,
    canDraggable = true,
  } = options

  const isDraggingRef = ref(false)
  const { use } = usePluginContext()
  const { startEventHook, moveEventHook, endEventHook, draggingEventHook } = useEventHook()

  function getCanDraggable(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (isBool(canDraggable) && canDraggable === false) {
      return false
    }
    if (isFunc(canDraggable) && canDraggable(target, event) === false) {
      return false
    }
    return true
  }

  function handleMouseDown(event: MouseEvent) {
    if (!getCanDraggable(event)) {
      isDraggingRef.value = false
      return
    }

    isDraggingRef.value = true
    startEventHook.trigger(event)
    draggingEventHook.trigger(event)
  }

  function handleMouseMove(event: MouseEvent) {
    if (!unref(isDraggingRef)) return
    moveEventHook.trigger(event)
    draggingEventHook.trigger(event)
  }

  function handleMouseUp(event: MouseEvent) {
    if (!unref(isDraggingRef)) return
    draggingEventHook.trigger(event)
    isDraggingRef.value = false
    endEventHook.trigger(event)
  }

  useEventListener(proxyTarget, 'mousedown', handleMouseDown)
  useEventListener(window, 'mousemove', handleMouseMove)
  useEventListener(window, 'mouseup', handleMouseUp)

  const context: UseReactionDragContext = {
    onStart: startEventHook.on,
    onMove: moveEventHook.on,
    onEnd: endEventHook.on,
    onDragging: draggingEventHook.on,
    isDragging: () => unref(isDraggingRef),
    getCanDraggable,
    use(plugin: Plugin) {
      return use(plugin, context) as any
    },
    useDragElement() {
      return useDragElement(context)
    },
  }

  return context
}
