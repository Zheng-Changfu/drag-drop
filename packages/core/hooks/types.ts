import type { EventHookOn } from '@reactive-drag/shared'
import type { Ref } from 'vue'

export type Plugin = (context: any) => any
export interface UseReactionDragContext {
  onStart: EventHookOn<MouseEvent>
  onMove: EventHookOn<MouseEvent>
  onEnd: EventHookOn<MouseEvent>
  onDragging: EventHookOn<MouseEvent>
  getCanDraggable: () => boolean
  isDragging: () => boolean
  getCanDropable: () => boolean
  use: (plugin: Plugin) => ({ pause: () => void; resume: () => void })
  useDragElement: () => Ref<HTMLElement | undefined>
}
