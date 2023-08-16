import { ref } from 'vue'

export function useCanDraggable() {
  const canDraggableRef = ref(false)
  const setCanDraggable = (val: boolean) => canDraggableRef.value = val

  return {
    canDraggable: canDraggableRef,
    setCanDraggable,
  }
}
