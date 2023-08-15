<script setup lang="tsx">
import { useReactionDrag } from '@reactive-drag/core'
import { mouseFollowPlugin } from '@reactive-drag/mouse-follow-plugin'
import { outlinePlugin } from '@reactive-drag/outline-plugin'
import { ref } from 'vue'

function canDraggable(element: HTMLElement) {
  return element.className.includes('draggable-')
}

const style = ref({ background: 'red' })
const context = useReactionDrag({ canDraggable })
context.use(mouseFollowPlugin({ text: params => params.element?.textContent ?? '' }))
context.use(outlinePlugin({ canDropable: canDraggable, style }))

setTimeout(() => {
  style.value.background = 'pink'
}, 3000)
</script>

<template>
  <div
    v-for="item in 3"
    :key="item"
    class="item"
    :class="[`draggable-${item}`]"
    :style="{ width: '100px', height: '100px', border: '1px solid #ccc' }"
  >
    {{ item }}
  </div>
</template>

<style scoped>
.item{
  user-select: none;
}
</style>
