export interface UseDragOptions {
  canDraggable?: boolean | ((element: HTMLElement, event: MouseEvent) => boolean)
  canDropable?: boolean | ((element: HTMLElement, event: MouseEvent) => boolean)
}
