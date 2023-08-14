<script setup lang="tsx">
import { type UseReactionDragContext, useReactionDrag } from '@reactive-drag/core'
import { computed, ref, unref } from 'vue'

const listRef = ref([
  { name: '11' },
  { name: '22' },
  { name: '33' },
])

function MouseFollowPlugin(context: UseReactionDragContext) {
  const currentDragElementRef = context.useDragElement()
  const positionRef = ref<{ x: number; y: number }>({ x: 0, y: 0 })

  context.onDragging((event) => {
    positionRef.value.x = event.clientX
    positionRef.value.y = event.clientY
  })

  const computedText = computed(() => {
    return currentDragElementRef.value?.textContent ?? ''
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
     }}>{ unref(computedText) }</div>
  }
}

function DropOutlinePlugin(context: UseReactionDragContext) {
  const positionRef = ref<{ x: number; y: number }>({ x: 0, y: 0 })

  context.onDragging((event) => {
    positionRef.value.x = event.clientX
    positionRef.value.y = event.clientY
  })

  const computedBoundingRect = computed(() => {
    const { x, y } = positionRef.value
    const element = document.elementFromPoint(x, y)
    if (element && canDraggable(element as any)) {
      return element.getBoundingClientRect()
    }
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    }
  })

  return () => {
    const { left, top, width, height } = unref(computedBoundingRect)

    return <div v-show={context.isDragging()} style={{
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      pointerEvents: 'none',
      zIndex: 'auto',
      transition: 'width 0.1s ease-in,height 0.1s ease-in,left 0.1s ease-in,top 0.1s ease-in',
      outline: 'dashed 1px #0071e7',
      background: 'rgba(0, 0, 0, 0.1)',
    }}></div>
  }
}

function canDraggable(element: HTMLElement) {
  return element.className.includes('draggable-')
}

const context = useReactionDrag({
  canDraggable,
})

context.use(MouseFollowPlugin)
context.use(DropOutlinePlugin)
</script>

<template>
  <div
    v-for="item in listRef"
    :key="item.name"
    class="item"
    :class="[`draggable-${item.name}`]"
    :style="{ width: '100px', height: '100px', border: '1px solid #ccc', margin: '10px' }"
  >
    {{ item.name }}
  </div>
</template>

<style scoped>
.item{
  user-select: none;
}
</style>
