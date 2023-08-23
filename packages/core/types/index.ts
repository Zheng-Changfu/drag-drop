import type { AnyFn } from '@drag-drop/shared'
import type { ComputedRef, Ref } from 'vue'

export type NullUndefinedAble<T> = T | null | undefined
export type MaybeBoolOrFunc<T extends AnyFn> = boolean | T

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

export interface DrapDropEventsCallback {
  onEnd: (event: EnhancedMouseEvent) => void
  onMove: (event: EnhancedMouseEvent) => void
  onStart: (event: EnhancedMouseEvent) => void
  onDragging: (event: EnhancedMouseEvent) => void
}

export interface UseDragDropContext {
  use: (plugin: DragDropPlugin) => UseReturn
  useDragging: () => Ref<boolean>
  pause: () => void
  resume: () => void
  useFrameList: () => Frame[]
  onEnd: (fn: DrapDropEventsCallback['onEnd']) => EventReturn
  onMove: (fn: DrapDropEventsCallback['onMove']) => EventReturn
  onStart: (fn: DrapDropEventsCallback['onStart']) => EventReturn
  onDragging: (fn: DrapDropEventsCallback['onDragging']) => EventReturn
  castEnhancedMouseEvent: (event: MouseEvent, iframe?: HTMLIFrameElement | undefined) => EnhancedMouseEvent
}

export interface DragDropPluginCtx {
  context: UseDragDropContext
  expose: <T>(data: T) => void
}

export type DragDropPlugin = (ctx: DragDropPluginCtx) => any

export interface Frame {
  iframeGetter: ComputedRef<HTMLIFrameElement | null>
  iframeWindowGetter: ComputedRef<Window | null>
  iframeDocumentGetter: ComputedRef<Document | null>
}
