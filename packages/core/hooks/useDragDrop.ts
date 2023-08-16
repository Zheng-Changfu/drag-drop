import type { AnyFn } from '@drag-drop/shared'
import { isBool, isFunc } from '@drag-drop/shared'
import { unref } from 'vue'
import type { UseDragOptions } from '../types'
import { useMouseDown } from './useMouseDown'
import { useCanDraggable } from './useCanDraggable'
import { useCanDropable } from './useCanDropable'
import { useDragging } from './useDragging'

export function useDragDrop(options: UseDragOptions = {}) {
  const { isDragging, setDragging } = useDragging()
  const { onStart, element, event } = useMouseDown({ isDragging })
  // const {} = useMouseMove()
  // const {} = useMouseUp()
  const { canDropable: _canDropable, setCanDropable } = useCanDropable()
  const { canDraggable: _canDraggable, setCanDraggable } = useCanDraggable()
  const { canDraggable = true, canDropable = true } = options

  function updateCanDraggable() {
    if (isBool(canDraggable) && canDraggable === false) {
      setCanDraggable(false)
      return
    }

    if (isFunc(canDraggable) && canDraggable(element, event) === false) {
      setCanDraggable(false)
      return
    }

    setCanDraggable(true)
  }

  function updateCanDropable() {
    if (isBool(canDropable) && canDropable === false) {
      setCanDropable(false)
      return
    }

    if (isFunc(canDropable) && canDropable(element, event) === false) {
      setCanDropable(false)
      return
    }

    setCanDropable(true)
  }

  function updateDragging() {
    unref(_canDraggable) ? setDragging(true) : setDragging(false)
  }

  onStart(updateCanDraggable)
  onStart(updateDragging)

  const context = {
    use: () => {

    },
    useMouseMove() {},
    useMouseUp() {},
    useDragging: () => isDragging,
    useCanDropable: () => _canDropable,
    useCanDraggable: () => _canDraggable,
    useMouseDown: () => ({
      element,
      event,
      onStart(fn: AnyFn) {
        onStart(() => {
          if (!unref(_canDraggable)) return
          fn()
        })
      },
    }),
  }

  return context
}
