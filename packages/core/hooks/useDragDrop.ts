import { type MaybeRefOrGetter, computed, ref, toValue, unref, watch } from 'vue'
import type { AnyFn } from '@drag-drop/shared'
import { createEventHook, isIframeTag, noop, tryOnScopeDispose, useEventListener } from '@drag-drop/shared'
import type { DragDropPlugin, EnhancedMouseEvent, Frame, UseDragDropContext } from '../types'
import { castEnhancedMouseEvent } from '../helpers/castEnhancedMouseEvent'
import { use } from '../helpers/plugin'
import { Scope } from './scope'

interface UseDragDropOptions {
  frames?: Array<MaybeRefOrGetter<HTMLIFrameElement | undefined>>
}
export function useDragDrop(options: UseDragDropOptions = {}): UseDragDropContext {
  const {
    frames,
  } = options
  const scope = new Scope()
  const frameList: Frame[] = []
  const isDraggingRef = ref(false)

  const { on: onEnd, trigger: dispatchEndEvent } = createEventHook<EnhancedMouseEvent>()
  const { on: onMove, trigger: dispatchMoveEvent } = createEventHook<EnhancedMouseEvent>()
  const { on: onStart, trigger: dispatchStartEvent } = createEventHook<EnhancedMouseEvent>()
  const { on: onDragging, trigger: dispatchDraggingEvent } = createEventHook<EnhancedMouseEvent>()

  function handleMouseDown(event: MouseEvent, iframe?: HTMLIFrameElement) {
    if (!scope.active) return
    const evt = castEnhancedMouseEvent(event, iframe)
    isDraggingRef.value = true
    dispatchStartEvent(evt)
    dispatchDraggingEvent(evt)
  }

  function handleMouseMove(event: MouseEvent, iframe?: HTMLIFrameElement) {
    if (!scope.active) return
    if (!unref(isDraggingRef)) return
    const evt = castEnhancedMouseEvent(event, iframe)
    dispatchMoveEvent(evt)
    dispatchDraggingEvent(evt)
  }

  function handleMouseUp(event: MouseEvent, iframe?: HTMLIFrameElement) {
    if (!scope.active) return
    if (!unref(isDraggingRef)) return
    const evt = castEnhancedMouseEvent(event, iframe)
    isDraggingRef.value = false
    dispatchEndEvent(evt)
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

  const cleanups: AnyFn[] = []
  let watchStopHandler: AnyFn = noop

  if (frames) {
    frames.forEach((frame) => {
      /**
       * iframe加载内容有2种情况
       * 1. 外界可能没有指定 src 属性，用的类似 render 函数直接挂载到 iframe 中,这样是触发不了 iframe 的 onload 事件的
       * 2. 外界指定了 src 属性,需要等到 iframe 加载完成后
       */

      const iframeGetter = computed(() => {
        const el = toValue(frame)
        if (isIframeTag(el)) {
          return el
        }
        return null
      })

      const iframeWindowGetter = computed(() => {
        const iframe = unref(iframeGetter)
        if (iframe) {
          return iframe.contentWindow
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

      watchStopHandler = watch(iframeGetter, (frame) => {
        if (!frame) return
        const canWaitIframeLoaded = !!frame.getAttribute('src')
        if (canWaitIframeLoaded) {
          const loadOff = useEventListener(iframeGetter, 'load', () => {
            const mouseDownOff = useEventListener(iframeDocumentGetter, 'mousedown', event => handleMouseDown(event, unref(iframeGetter)!))
            const mouseMoveOff = useEventListener(iframeDocumentGetter, 'mousemove', event => handleMouseMove(event, unref(iframeGetter)!))
            const mouseUpOff = useEventListener(iframeDocumentGetter, 'mouseup', event => handleMouseUp(event, unref(iframeGetter)!))

            frameList.push({
              iframeGetter,
              iframeWindowGetter,
              iframeDocumentGetter,
            })

            cleanups.push(
              mouseDownOff,
              mouseMoveOff,
              mouseUpOff,
              () => frameList.pop(),
              loadOff,
            )
          })
        }
        else {
          const mouseDownOff = useEventListener(iframeDocumentGetter, 'mousedown', event => handleMouseDown(event, unref(iframeGetter)!))
          const mouseMoveOff = useEventListener(iframeDocumentGetter, 'mousemove', event => handleMouseMove(event, unref(iframeGetter)!))
          const mouseUpOff = useEventListener(iframeDocumentGetter, 'mouseup', event => handleMouseUp(event, unref(iframeGetter)!))

          frameList.push({
            iframeGetter,
            iframeWindowGetter,
            iframeDocumentGetter,
          })

          cleanups.push(
            mouseDownOff,
            mouseMoveOff,
            mouseUpOff,
            () => frameList.pop(),
          )
        }
      })
      cleanups.push(watchStopHandler)
    })
  }

  const stop = () => {
    cleanups.forEach(fn => fn())
    cleanups.length = 0
    watchStopHandler()
  }

  const context: UseDragDropContext = {
    onEnd,
    onMove,
    onStart,
    onDragging,
    useDragging,
    useFrameList,
    castEnhancedMouseEvent,
    use(plugin: DragDropPlugin) {
      return use(context, plugin)!
    },
    pause() {
      return scope.pause()
    },
    resume() {
      return scope.resume()
    },
  }

  tryOnScopeDispose(stop)

  return context
}
