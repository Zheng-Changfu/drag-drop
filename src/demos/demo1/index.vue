<script setup lang="ts">
import { useDragDrop } from '@drag-drop/core'

const context = useDragDrop({

})
const dragging = context.useDragging()
const { event, element, onStart } = context.useMouseDown()

onStart(() => {
  console.log(333)
})
</script>

<template>
  <h1>dragging:{{ dragging }}</h1>
  <h1>dragging:{{ event }}</h1>
  <h1>dragging:{{ element }}</h1>
</template>
