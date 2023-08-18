<script setup lang="tsx">
import type { EnhancedMouseEvent } from '@drag-drop/core'
import { useDragDrop } from '@drag-drop/core'
import type { OutlinePluginExposed } from '@drag-drop/plugin-outline'
import { outlinePlugin } from '@drag-drop/plugin-outline'
import type { CSSProperties } from 'vue'

const style: CSSProperties = { userSelect: 'none' }
function canDropable(event: EnhancedMouseEvent) {
  const target = event.target
  return !!target?.classList.contains('item') || !!target?.classList.contains('container')
}
const context = useDragDrop({ canDropable })
const { exposed, pause, resume } = context.use(outlinePlugin())
const { trigger } = exposed as OutlinePluginExposed

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

setTimeout(() => {
  pause()
  console.log('stop')
  setTimeout(() => {
    console.log('resume')
    resume()
  }, 2000)
}, 3000)

function handleTriggerOutLine() {
  const id = random(1, 6)
  const element = document.getElementById(`${id}`)
  element && trigger(element)
}
</script>

<template>
  <h1>拖拽 | 点击手柄</h1>
  <div id="1" class="container">
    <div id="2" class="item" :style="style" style="--color:red">
      h1
    </div>
    <div id="3" class="item" :style="style" style="--color:pink">
      h2
    </div>
    <div id="4" class="item" :style="style" style="--color:skyblue">
      h3
    </div>
    <div id="5" class="item" :style="style" style="--color:yellow">
      h4
    </div>
    <div id="6" class="item" :style="style" style="--color:orange">
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
}

.item{
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  background-color: var(--color);
}
</style>
