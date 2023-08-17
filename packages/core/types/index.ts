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

export interface UseReturn<ExposedData = {}> {
  pause: () => void
  resume: () => void
  use: UseDragDropContext['use']
  exposed: ExposedData
}

export interface EventReturn {
  off: () => void
}

export interface UseDragDropContext<ExposedData = {}> {
  use: (plugin: DragDropPlugin) => UseReturn<ExposedData>
  useDragging: () => Ref<boolean>
  useCanDropable: () => Ref<boolean>
  useCanDraggable: () => Ref<boolean>
  onStart: (fn: (params: MouseEventParams) => void) => EventReturn
  onMove: (fn: (params: MouseEventParams) => void) => EventReturn
  onEnd: (fn: (params: MouseEventParams) => void) => EventReturn
  onDragging: (fn: (params: MouseEventParams) => void) => EventReturn
}

export type DragDropPlugin<T extends Record<string, any> = {}> = (context: UseDragDropContext, { expose }: { expose: T }) => any
