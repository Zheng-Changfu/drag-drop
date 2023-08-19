import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import naive from 'naive-ui'
import App from './App.vue'
import { routes } from './routes'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.use(router)
app.use(naive)
app.mount('#app')
