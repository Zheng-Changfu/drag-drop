import { ref } from 'vue'

export function useCanDropable() {
  const canDropableRef = ref(false)
  const setCanDropable = (val: boolean) => canDropableRef.value = val

  return {
    canDropable: canDropableRef,
    setCanDropable,
  }
}
