<script setup lang="tsx">
import { useDragDrop } from '@drag-drop/core'
import { mouseFollowPlugin } from '@drag-drop/plugin-mouse-follow'
import type { CSSProperties } from 'vue'
import { computed, ref } from 'vue'
import { IframeContainer } from '../../IframeContainer'

const iframeInstRef = ref()
const context = useDragDrop({
  canDraggable: event => !!event.target?.classList.contains('item'),
  frames: [
    computed(() => iframeInstRef.value?.$el),
  ],
})
context.use(mouseFollowPlugin({ text: params => params?.target?.textContent ?? '' }))

const style: CSSProperties = { userSelect: 'none' }
</script>

<template>
  <h1 class="item" :style="style">
    h1
  </h1>
  <h2 class="item" :style="style">
    h2
  </h2>
  <h3 class="item" :style="style">
    h3
  </h3>
  <h4 class="item" :style="style">
    h4
  </h4>
  <h5 class="item" :style="style">
    h5
  </h5>
  <IframeContainer ref="iframeInstRef" :style="{ width: '500px', height: '500px' }">
    <h1 class="item" :style="style">
      iframe...h1
    </h1>
    <h2 class="item" :style="style">
      iframe...h2
    </h2>
    <h3 class="item" :style="style">
      iframe...h3
    </h3>
    <h4 class="item" :style="style">
      iframe...h4
    </h4>
    <h5 class="item" :style="style">
      iframe...h5
    </h5>
  </IframeContainer>
</template>
