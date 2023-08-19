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
  {
    path: '/outline',
    component: () => import('./demos/outline/index.vue'),
    meta: {
      desc: 'outline 插件演示',
    },
  },
  {
    path: '/sort',
    component: () => import('./demos/sort/index.vue'),
    meta: {
      desc: '排序插件演示',
    },
  },
  {
    path: '/sort-two',
    component: () => import('./demos/sort-two/index.vue'),
    meta: {
      desc: '2个列表排序插件演示',
    },
  },
]
