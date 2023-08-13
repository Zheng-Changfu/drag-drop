<script setup lang="ts">
import { createReactiveDrag } from '@reactive-drag/core'
import { ref } from 'vue'

const draggableTargetRef = ref<HTMLElement>()
const dropableTargetRef = ref<HTMLElement>()

const [useDraggable, useDropable] = createReactiveDrag()
useDraggable({ proxyTarget: draggableTargetRef })
useDropable({ proxyTarget: dropableTargetRef })
</script>

<template>
  <div>
    <div ref="draggableTargetRef" class="draggable" />
    <div ref="dropableTargetRef" class="dropable" />
  </div>
</template>

<style scoped>
div {
  display: flex;
}

.draggable {
  width: 300px;
  height: 300px;
  background-color: red;
}

.dropable {
  margin-left: 300px;
  width: 300px;
  height: 300px;
  background-color: skyblue;
}
</style>
