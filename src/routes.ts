export const routes = [
  {
    path: '/',
    redirect: '/mouse-follow',
  },
  {
    path: '/mouse-follow',
    component: () => import('./demos/mouse-follow/index.vue'),
    meta: {
      desc: '鼠标跟随插件演示',
    },
  },
]
