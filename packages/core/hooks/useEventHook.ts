import { createEventHook } from '@reactive-drag/shared'

export function useEventHook() {
  const startEventHook = createEventHook<MouseEvent>()
  const moveEventHook = createEventHook<MouseEvent>()
  const endEventHook = createEventHook<MouseEvent>()
  const draggingEventHook = createEventHook<MouseEvent>()

  return {
    startEventHook,
    moveEventHook,
    endEventHook,
    draggingEventHook,
  }
}
