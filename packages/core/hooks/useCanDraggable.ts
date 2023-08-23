import { isBool, isFunc } from '@drag-drop/shared'
import type { EnhancedMouseEvent } from '../types'

export function getCanDraggable(event: EnhancedMouseEvent, canDraggable: boolean | ((event: EnhancedMouseEvent) => boolean)) {
  if (isBool(canDraggable) && canDraggable === false) {
    return false
  }
  if (isFunc(canDraggable) && canDraggable(event) === false) {
    return false
  }
  return true
}
