<script setup lang="tsx">
import type { UseReactionDragContext } from '@reactive-drag/core'
import { useReactionDrag } from '@reactive-drag/core'
import { ref, unref } from 'vue'

function canDraggable(element: HTMLElement) {
  return element.className.startsWith('draggable-')
}
const context = useReactionDrag({
  canDraggable,
})

function MouseFollowPlugin(context: UseReactionDragContext) {
  const textRef = ref('')
  const positionRef = ref<{ x: number; y: number }>({ x: 0, y: 0 })

  context.onStart((event) => {
    const element = event.target as HTMLElement
    textRef.value = element.textContent ?? ''
  })

  context.onDragging((event) => {
    positionRef.value.x = event.clientX
    positionRef.value.y = event.clientY
  })

  return () => {
    const { x, y } = unref(positionRef)

    return <div
     v-show={context.isDragging()}
     style={{
       position: 'fixed',
       top: `${y}px`,
       left: `${x}px`,
       zIndex: 1,
       color: '#fff',
       padding: '4px 8px',
       background: '#0000f6',
       whiteSpace: 'nowrap',
       pointerEvents: 'none',
     }}>{ unref(textRef) }</div>
  }
}

context.use(MouseFollowPlugin)
</script>

<template>
  <div
    v-for="item in 3"
    :key="item"
    :class="[`draggable-${item}`]"
    :style="{ width: '100px', height: '100px', border: '1px solid #ccc', margin: '10px' }"
  >
    {{ item }}
  </div>
</template>
