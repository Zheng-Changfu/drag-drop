<script setup lang="tsx">
import type { EnhancedMouseEvent } from '@drag-drop/core'
import { useDragDrop } from '@drag-drop/core'
import { sortPlugin } from '@drag-drop/plugin-sort'
import { useEventListener } from '@drag-drop/shared'
import { computed, ref, unref } from 'vue'

interface Item {
  id: string
  name: string
  color: string
}
const baseBackgroundColor = 'skyblue'
const swapBackgroundColor = 'pink'

const listRef = ref<Item[]>([
  { id: '1', name: '1', color: baseBackgroundColor },
  { id: '2', name: '2', color: baseBackgroundColor },
  { id: '3', name: '3', color: baseBackgroundColor },
  { id: '4', name: '4', color: baseBackgroundColor },
  { id: '5', name: '5', color: baseBackgroundColor },
  { id: '6', name: '6', color: baseBackgroundColor },
  { id: '7', name: '7', color: baseBackgroundColor },
])

const id2IndexByListGetter = computed(() => {
  const list = unref(listRef)
  return list.reduce((p, c, i) => {
    p.set(c.id, i)
    return p
  }, new Map<string, number>())
})

function canDraggable(event: EnhancedMouseEvent) {
  return !!event.target?.classList.contains('item')
}

function tryUpdateColor(event: EnhancedMouseEvent, color: string) {
  const index = getIndex(event)
  if (~index) {
    listRef.value[index].color = color
  }
}

const context = useDragDrop()

const { pause, resume } = context.use(sortPlugin({
  sort,
  canDraggable,
  onStart: event => tryUpdateColor(event, swapBackgroundColor),
}))

function getIndex(event: EnhancedMouseEvent) {
  const element = event.target!
  const id = element.getAttribute('id')
  return unref(id2IndexByListGetter).get(id as any) ?? -1
}

function sort(startEvent: EnhancedMouseEvent, moveEvent: EnhancedMouseEvent) {
  const startIndex = getIndex(startEvent)
  const targetIndex = getIndex(moveEvent)

  if ((~startIndex) && (~targetIndex) && startIndex !== targetIndex) {
    const list = unref(listRef)
    const temp = list[startIndex]
    list[startIndex] = list[targetIndex]
    list[targetIndex] = temp
    pause()
  }
}

function resetColor() {
  const list = unref(listRef)
  const updatedColorItem = list.find(item => item.color === swapBackgroundColor)
  if (updatedColorItem) {
    updatedColorItem.color = baseBackgroundColor
  }
}

useEventListener('transitionend', () => {
  resume()
})

context.onEnd(resetColor)
</script>

<template>
  <TransitionGroup tag="div" class="container" name="list">
    <div v-for="item in listRef" :id="item.id" :key="item.id" class="item" :style="{ background: item.color }">
      {{ item.name }}
    </div>
  </TransitionGroup>
</template>

<style scoped>
.list-move{
  transition: transform 0.1s linear;
}

.container{
  display:inline-flex;
  flex-direction:column;
  gap:10px;
  margin:100px 0 0 30px;
  padding:20px;
  border:1px solid #ccc;
}
.item{
  display:flex;
  align-items:center;
  justify-content:center;
  width:200px;
  height:40px;
  user-select:none;
  border-radius:5px;
}
</style>
