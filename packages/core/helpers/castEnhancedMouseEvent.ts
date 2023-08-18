import { getBoundingClientRect } from '@drag-drop/shared'
import type { EnhancedMouseEvent, NullUndefinedAble } from '../types'

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
      target: target as NullUndefinedAble<HTMLElement>,
      originEvent: event,
      iframe: undefined,
      inIframe: false,
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
    target: target as NullUndefinedAble<HTMLElement>,
    inIframe: true,
    iframe,
  }
}
