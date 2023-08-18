import type { ComputedRef, Ref } from 'vue'

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
  inIframe: boolean
  iframe: HTMLIFrameElement | undefined
  target: NullUndefinedAble<HTMLElement>
  originEvent: MouseEvent
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

export interface DropDropEventsCallback {
  onEnd: (event: EnhancedMouseEvent) => void
  onMove: (event: EnhancedMouseEvent) => void
  onStart: (event: EnhancedMouseEvent) => void
  onDragging: (event: EnhancedMouseEvent) => void
}

export interface UseDragDropContext {
  use: (plugin: DragDropPlugin) => UseReturn
  useDragging: () => Ref<boolean>
  useCanDropable: () => Ref<boolean>
  useCanDraggable: () => Ref<boolean>
  useFrameList: () => Frame[]
  onEnd: (fn: DropDropEventsCallback['onEnd']) => EventReturn
  onMove: (fn: DropDropEventsCallback['onMove']) => EventReturn
  onStart: (fn: DropDropEventsCallback['onStart']) => EventReturn
  onDragging: (fn: DropDropEventsCallback['onDragging']) => EventReturn
  castEnhancedMouseEvent: (event: MouseEvent, iframe?: HTMLIFrameElement | undefined) => EnhancedMouseEvent
}

export interface DragDropPluginCtx {
  context: UseDragDropContext
  expose: <T>(data: T) => void
}

export type DragDropPlugin = (ctx: DragDropPluginCtx) => any

export interface Frame {
  iframeGetter: ComputedRef<HTMLIFrameElement | null>
  iframeDocumentGetter: ComputedRef<Document | null>
}
