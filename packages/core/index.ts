import { useEventListener } from '@reactive-drag/shared'
import { type MaybeRefOrGetter, ref, unref } from 'vue'

type AnyFn = (...args: any[]) => any

interface UseDraggableOptions {
  proxyTarget?: MaybeRefOrGetter<HTMLElement | null | undefined | Document>
}

function useDraggable(options: UseDraggableOptions = {}) {
  const { proxyTarget = document } = options
  const isDraggingRef = ref(false)

  useEventListener(proxyTarget, 'mousedown', () => {
    isDraggingRef.value = true
    console.log('down')
  }, { capture: true })

  useEventListener('mousemove', () => {
    if (!unref(isDraggingRef)) return
    console.log('move')
  }, { capture: true })

  useEventListener('mouseup', () => {
    if (!unref(isDraggingRef)) return
    console.log('up')
    isDraggingRef.value = false
  }, { capture: true })
}

interface UseDropableOptions extends UseDraggableOptions {}
function useDropable(options: UseDropableOptions = {}) {
  const { proxyTarget = document, composition = false } = options

  useEventListener(proxyTarget, 'mouseenter', () => {
    console.log('enter')
  })

  useEventListener(proxyTarget, 'mouseleave', () => {
    console.log('leave')
  })
}

function connect<T extends AnyFn, K extends AnyFn>(useDraggable: T, useDropable: K) {
  const _useDraggable = (options: UseDraggableOptions = {}) => useDraggable({ ...options, composition: true })
  const _useDropable = (options: UseDropableOptions = {}) => useDropable({ ...options, composition: true })

  return [_useDraggable, _useDropable]
}

export type CreateReactiveDragReturn = ReturnType<typeof createReactiveDrag>

export function createReactiveDrag() {
  const res = connect(useDraggable, useDropable)
  return res
}
