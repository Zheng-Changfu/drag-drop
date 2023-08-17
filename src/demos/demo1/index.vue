<script setup lang="tsx">
import { useDragDrop } from '@drag-drop/core'
import { ref } from 'vue'

const iframeRef = ref<HTMLIFrameElement>()
const context = useDragDrop({ frames: [iframeRef] })
const isDragging = context.useDragging()

const { pause, resume, exposed } = context.use(({ context, expose }) => {
  expose({ a: 1, b: 2 })
  context.onDragging(() => {
    console.log(33333)
  })
  return () => {
    return <h1>123</h1>
  }
})

console.log(exposed)

setTimeout(() => {
  console.log('stop')
  pause()
  setTimeout(() => {
    console.log('resume')
    resume()
  }, 2000)
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
