import type { Ref } from 'vue'

export type NullUndefinedAble<T> = T | null | undefined

export interface EnhancedMouseEvent {
  x: number
  y: number
  pageX: number
  pageY: number
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  screenX: number
  screenY: number
  target: NullUndefinedAble<HTMLElement>
  originEvent: MouseEvent
}

export interface MouseEventParams {
  event: EnhancedMouseEvent
  target: NullUndefinedAble<HTMLElement>
  inIframe: boolean
}

export interface UseReturn {
  pause: () => void
  resume: () => void
  use: UseDragDropContext['use']
  exposed: any
}

export interface EventReturn {
  off: () => void
}

export interface UseDragDropContext {
  use: (plugin: DragDropPlugin) => UseReturn
  useDragging: () => Ref<boolean>
  useCanDropable: () => Ref<boolean>
  useCanDraggable: () => Ref<boolean>
  onStart: (fn: (params: MouseEventParams) => void) => EventReturn
  onMove: (fn: (params: MouseEventParams) => void) => EventReturn
  onEnd: (fn: (params: MouseEventParams) => void) => EventReturn
  onDragging: (fn: (params: MouseEventParams) => void) => EventReturn
}

export interface DragDropPluginCtx {
  context: UseDragDropContext
  expose: <T>(data: T) => void
}

export type DragDropPlugin = (ctx: DragDropPluginCtx) => any
