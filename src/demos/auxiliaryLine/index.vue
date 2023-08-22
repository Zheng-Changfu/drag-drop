<script setup lang="tsx">
import { useDragDrop } from '@drag-drop/core'
import { auxiliaryLinePlugin } from '@drag-drop/plugin-auxiliary-line'
import { mouseFollowPlugin } from '@drag-drop/plugin-mouse-follow'
import { computed, ref } from 'vue'
import { IframeContainer } from '../../IframeContainer'

const iframeInstRef = ref()
const iframeElRef = ref()
const context = useDragDrop({
  canDraggable: event => !!event.target?.classList.contains('materiel-item'),
  canDropable: event => !!event.target?.classList.contains('node'),
  frames: [
    computed(() => iframeInstRef.value?.$el),
    iframeElRef,
  ],
})

context.use(mouseFollowPlugin({
  text: event => event?.target?.textContent ?? '',
}))
context.use(auxiliaryLinePlugin())
</script>

<template>
  <div class="container">
    <div class="left-panel">
      <div class="materiel-item">
        物料1
      </div>
      <div class="materiel-item">
        物料2
      </div>
      <div class="materiel-item">
        物料3
      </div>
      <div class="materiel-item">
        物料4
      </div>
      <div class="materiel-item">
        物料5
      </div>
    </div>
    <div class="canvas-panel">
      <IframeContainer ref="iframeInstRef" :show-title="false">
        <div :style="{ display: 'flex', gap: '10px', padding: '5px', border: '1px solid #ccc', userSelect: 'none' }" class="node">
          <span :style="{ color: 'red', border: '1px solid #ccc' }" class="node">节点1</span>
          <span :style="{ color: 'pink', border: '1px solid #ccc' }" class="node">节点2</span>
          <span :style="{ color: 'skyblue', border: '1px solid #ccc' }" class="node">节点3</span>
        </div>
      </IframeContainer>
      <iframe ref="iframeElRef" src="./frame.html" />
    </div>
  </div>
</template>

<style scoped>
.container{
  display: flex;
  margin: 100px 0 0 0;
}
.left-panel{
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  gap: 10px;
  user-select: none;
}
.materiel-item{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border: 1px solid #ccc;
}
</style>
