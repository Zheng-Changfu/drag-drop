<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { routes } from './routes'

const tabs = routes?.slice(1)
const router = useRouter()
const route = useRoute()
function handleJumpDemo(path: string) {
  router.push(path)
}

const hideDemosNavGetter = computed(() => {
  const matched = route.matched
  return matched[0]?.meta?.hideNavBar === true
})
</script>

<template>
  <div v-if="!hideDemosNavGetter" class="demos">
    <div v-for="(item, index) in tabs" :key="index" @click="handleJumpDemo(item.path)">
      {{ item?.meta?.desc }}
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
