import { getBoundingClientRect } from '@drag-drop/shared'
import type { EnhancedMouseEvent } from '../types'

export function castEnhancedMouseEvent(event: MouseEvent, iframe?: HTMLIFrameElement): EnhancedMouseEvent {
  const {
    x,
    y,
    pageX,
    pageY,
    clientX,
    clientY,
    offsetX,
    offsetY,
    screenX,
    screenY,
    target,
  } = event

  if (!iframe) {
    return {
      x,
      y,
      pageX,
      pageY,
      clientX,
      clientY,
      offsetX,
      offsetY,
      screenX,
      screenY,
      target: target as HTMLElement | null | undefined,
      originEvent: event,
    }
  }

  const { left, top } = getBoundingClientRect(iframe)

  return {
    x: x + left,
    y: y + top,
    pageX: pageX + left,
    pageY: pageY + top,
    clientX: clientX + left,
    clientY: clientY + top,
    offsetX: offsetX + left,
    offsetY: offsetY + top,
    screenX: screenX + left,
    screenY: screenY + top,
    originEvent: event,
    target: target as HTMLElement | null | undefined,
  }
}
