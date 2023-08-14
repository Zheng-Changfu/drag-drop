<script setup lang="tsx">
import { type UseReactionDragContext, useReactionDrag } from '@reactive-drag/core'
import { computed, ref, unref, watch } from 'vue'

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

function SwapElementPlugin(context: UseReactionDragContext) {
  const positionRef = ref<{ x: number; y: number }>({ x: 0, y: 0 })
  const currentDragElementRef = context.useDragElement()

  function getIndex(element: HTMLElement) {
    const content = element.textContent
    const list = unref(listRef)
    return list.findIndex(item => item.name === content)
  }

  function swapIndex(startIndex: number, endIndex: number) {
    const list = unref(listRef)
    const tempItem = list[startIndex]
    list[startIndex] = list[endIndex]
    list[endIndex] = tempItem
  }

  context.onDragging((event) => {
    positionRef.value.x = event.clientX
    positionRef.value.y = event.clientY
  })

  watch(() => positionRef.value, () => {
    const { x, y } = positionRef.value
    const element = document.elementFromPoint(x, y)

    if (element && canDraggable(element as any)) {
      const currentIndex = getIndex(currentDragElementRef.value!)
      const moveToIndex = getIndex(element as any)

      if (currentIndex !== moveToIndex) {
        swapIndex(currentIndex, moveToIndex)
      }
    }
  }, { deep: true })
}

function canDraggable(element: HTMLElement) {
  return element.className.includes('draggable-')
}

const context = useReactionDrag({
  canDraggable,
})

context.use(MouseFollowPlugin) // 鼠标跟随插件
context.use(SwapElementPlugin) // 数据交换插件
</script>

<template>
  <TransitionGroup tag="ul" name="fade" class="container">
    <div
      v-for="item in listRef"
      :key="item.name"
      class="item"
      :class="[`draggable-${item.name}`]"
      :style="{ width: '100px', height: '100px', border: '1px solid #ccc', margin: '10px' }"
    >
      {{ item.name }}
    </div>
  </TransitionGroup>
</template>

<style scoped>
.container {
  position: relative;
  padding: 0;
}

.item{
  user-select: none;
}
/* 1. 声明过渡效果 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(0px, 0);
}

/* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
.fade-leave-active {
  position: absolute;
}
</style>
