<script setup lang="ts">
import { useRouter } from 'vue-router'
import { routes } from './routes'

const tabs = routes?.slice(1)
const router = useRouter()

function handleJumpDemo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="demos">
    <div v-for="(item, index) in tabs" :key="index" @click="handleJumpDemo(item.path)">
      {{ item.meta.desc }}
    </div>
  </div>
  <RouterView />
</template>

<style scoped>
.demos {
  display: flex;
  gap: 10px;
}
</style>
