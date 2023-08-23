<script setup lang="tsx">
import { useDragDrop } from '@drag-drop/core'
import type { OutlinePluginExposed } from '@drag-drop/plugin-outline'
import { outlinePlugin } from '@drag-drop/plugin-outline'
import { useEventListener } from '@drag-drop/shared'

const context = useDragDrop()
const { exposed } = context.use(outlinePlugin({
  showOutline(rect) {
    const element = document.elementFromPoint(rect.x, rect.y)
    if (!element) {
      return false
    }
    return element.classList.contains('item') || element.classList.contains('container')
  },
}))
const { trigger } = exposed as OutlinePluginExposed

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function handleTriggerOutLine(e: Event) {
  context.pause()
  const id = random(1, 6)
  const element = document.getElementById(`${id}`)
  element && trigger(element)
}

useEventListener('transitionend', () => context.resume())
</script>

<template>
  <h1>拖拽 | 点击手柄</h1>
  <div id="1" class="container">
    <div id="2" class="item" style="--color:red">
      h1
    </div>
    <div id="3" class="item" style="--color:pink">
      h2
    </div>
    <div id="4" class="item" style="--color:skyblue">
      h3
    </div>
    <div id="5" class="item" style="--color:yellow">
      h4
    </div>
    <div id="6" class="item" style="--color:orange">
      h5
    </div>
    <div id="7" class="item" style="--color:orange">
      h5
    </div>
    <div id="8" class="item" style="--color:orange">
      h5
    </div>
  </div>
  <button @click="handleTriggerOutLine">
    手柄
  </button>
</template>

<style scoped>
.container{
  display: flex;
  gap:8px;
  user-select: none;
}

.item{
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  background-color: var(--color);
}
</style>
