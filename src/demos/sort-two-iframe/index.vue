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

const list1Ref = ref<Item[]>([
  { id: '1', name: '1', color: baseBackgroundColor },
  { id: '2', name: '2', color: baseBackgroundColor },
  { id: '3', name: '3', color: baseBackgroundColor },
  { id: '4', name: '4', color: baseBackgroundColor },
  { id: '5', name: '5', color: baseBackgroundColor },
  { id: '6', name: '6', color: baseBackgroundColor },
  { id: '7', name: '7', color: baseBackgroundColor },
])

const list2Ref = ref<Item[]>([
  { id: '8', name: '8', color: baseBackgroundColor },
  { id: '9', name: '9', color: baseBackgroundColor },
  { id: '10', name: '10', color: baseBackgroundColor },
  { id: '11', name: '11', color: baseBackgroundColor },
  { id: '12', name: '12', color: baseBackgroundColor },
  { id: '13', name: '13', color: baseBackgroundColor },
  { id: '14', name: '14', color: baseBackgroundColor },
])

const id2IndexByList1Getter = computed(() => {
  const list = unref(list1Ref)
  return list.reduce((p, c, i) => {
    p.set(c.id, i)
    return p
  }, new Map<string, number>())
})

const id2IndexByList2Getter = computed(() => {
  const list = unref(list2Ref)
  return list.reduce((p, c, i) => {
    p.set(c.id, i)
    return p
  }, new Map<string, number>())
})

function canDraggable(event: EnhancedMouseEvent) {
  return !!event.target?.classList.contains('item')
}

function tryUpdateColor(val: EnhancedMouseEvent | Item, color: string) {
  const isItem = (v: any): v is Item => v.id && v.name
  if (isItem(val)) {
    val.color = color
    return
  }
  const indexAndList = getIndexAndListByEvent(val)
  if (!indexAndList) return
  const { index, list } = indexAndList
  list[index].color = color
}

function resetColor() {
  const list1 = unref(list1Ref)
  const list2 = unref(list2Ref)
  const updatedColorItem = [...list1, ...list2].find(item => item.color === swapBackgroundColor)
  if (updatedColorItem) {
    updatedColorItem.color = baseBackgroundColor
  }
}

const context = useDragDrop({
  canDraggable,
})

const { pause, resume } = context.use(sortPlugin({
  swap,
  onStart: event => tryUpdateColor(event, swapBackgroundColor),
}))

function getIndexAndListByEvent(event: EnhancedMouseEvent) {
  const element = event.target!
  const id = element.getAttribute('id') as string
  const list1Getter = unref(id2IndexByList1Getter)
  const list2Getter = unref(id2IndexByList2Getter)

  if (list1Getter.has(id)) {
    return {
      index: list1Getter.get(id)!,
      list: unref(list1Ref),
    }
  }

  if (list2Getter.has(id)) {
    return {
      index: list2Getter.get(id)!,
      list: unref(list2Ref),
    }
  }
}

async function swap(startEvent: EnhancedMouseEvent, moveEvent: EnhancedMouseEvent) {
  const startIndexAndList = getIndexAndListByEvent(startEvent)
  const targetIndexAndList = getIndexAndListByEvent(moveEvent)
  if (!startIndexAndList || !targetIndexAndList) return
  const { index: startIndex, list: list1 } = startIndexAndList
  const { index: targetIndex, list: list2 } = targetIndexAndList
  if (list1 === list2 && startIndex === targetIndex) return
  // swap
  const temp = list1[startIndex]
  list1[startIndex] = list2[targetIndex]
  list2[targetIndex] = temp
  tryUpdateColor(temp, swapBackgroundColor)
  pause()
}

useEventListener('transitionend', resume)

context.onEnd(resetColor)
</script>

<template>
  <TransitionGroup tag="div" class="container" name="list">
    <div v-for="item in list1Ref" :id="item.id" :key="item.id" class="item" :style="{ background: item.color }">
      {{ item.name }}
    </div>
  </TransitionGroup>
  <TransitionGroup tag="div" class="container" name="list">
    <div v-for="item in list2Ref" :id="item.id" :key="item.id" class="item" :style="{ background: item.color }">
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
