<script setup lang="tsx">
import type { UseDragDropContext } from '@drag-drop/core'
import { useDragDrop } from '@drag-drop/core'
import { ref } from 'vue'

const iframeRef = ref<HTMLIFrameElement>()
const context = useDragDrop({ frames: [iframeRef] })
const isDragging = context.useDragging()

function testPlugin() {
  return function (context: UseDragDropContext, { expose }: any) {
    console.log(context, expose, '@')

    context.onDragging(() => {
      console.log(33333)
    })
    return () => {
      return <h1>123</h1>
    }
  }
}

const pluginScope = context.use(testPlugin())

setTimeout(() => {
  pluginScope.pause()
}, 3000)
// onMounted(() => {
//   const doc = iframeRef.value?.contentDocument
//   if (doc) {
//     render(h(FrameComponent), doc.body)
//   }
// })
</script>

<template>
  <h1>dragging:{{ isDragging }}</h1>
  <!-- <iframe ref="iframeRef" width="500" height="500" /> -->
</template>
