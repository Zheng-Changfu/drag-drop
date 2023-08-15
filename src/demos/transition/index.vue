<script setup lang="ts">
import { useReactionDrag } from '@reactive-drag/core'
import type { UseReactionDragContext } from '@reactive-drag/core'
import { useActiveElement } from '@reactive-drag/shared'
import { watch } from 'vue'
import { useDraggable } from '@vueuse/core'

function canDraggable(element: HTMLElement) {
  return element.className.startsWith('draggable-')
}

const context = useReactionDrag()

function draggablePlugin(context: UseReactionDragContext) {
  const activeElementRef = useActiveElement({ trigger: 'hover' })

  const { x, y } = useDraggable(activeElementRef)

  watch([x, y], () => {
    if (activeElementRef.value && canDraggable(activeElementRef.value)) {
      activeElementRef.value.style.position = 'fixed'
      activeElementRef.value.style.left = `${x.value}px`
      activeElementRef.value.style.top = `${y.value}px`
    }
  })
}

context.use(draggablePlugin)
const id = 0
</script>

<template>
  <div
    v-for="item in 3"
    :key="String(++id)"
    :class="[`draggable-${item}`]"
    :style="{ width: '100px', height: '100px', border: '1px solid #ccc', margin: '10px' }"
  >
    {{ item }}
  </div>
</template>
