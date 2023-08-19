<script setup lang="tsx">
import type { EnhancedMouseEvent } from '@drag-drop/core'
import { useDragDrop } from '@drag-drop/core'
import { sortPlugin } from '@drag-drop/plugin-sort'
import { useEventListener } from '@drag-drop/shared'
import { computed, ref, unref } from 'vue'

interface Item {
  id: string
  name: string
}
const listRef = ref<Item[]>([
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: '5', name: '5' },
  { id: '6', name: '6' },
  { id: '7', name: '7' },
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

function updateElementBackground(event: EnhancedMouseEvent, color: string) {
  const element = event.target!
  element.style.background = color
}

const context = useDragDrop({
  canDraggable,
})

let mouseDownEvent: EnhancedMouseEvent
const { pause, resume } = context.use(sortPlugin({
  swap,
  onStart: event => (mouseDownEvent = event) && updateElementBackground(event, 'pink'),
  onEnd: () => updateElementBackground(mouseDownEvent, 'skyblue'),
}))

function getIndex(event: EnhancedMouseEvent) {
  const element = event.target!
  const id = element.getAttribute('id')
  return unref(id2IndexByListGetter).get(id as any) ?? -1
}

function swap(startEvent: EnhancedMouseEvent, moveEvent: EnhancedMouseEvent) {
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

useEventListener(window, 'transitionend', () => {
  resume()
})
</script>

<template>
  <TransitionGroup tag="div" class="container" name="list">
    <div v-for="item in listRef" :id="item.id" :key="item.id" class="item">
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
  background-color:skyblue;
  user-select:none;
  border-radius:5px;
}
</style>
