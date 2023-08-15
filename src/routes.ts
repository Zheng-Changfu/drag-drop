export const routes = [
  {
    path: '/',
    redirect: '/demo1',
  },
  {
    path: '/demo1',
    component: () => import('./demos/demo1/index.vue'),
    meta: {
      desc: '自由拖拽',
    },
  },
  {
    path: '/demo2',
    component: () => import('./demos/demo2/index.vue'),
    meta: {
      desc: '拖拽内容显示',
    },
  },
  {
    path: '/demo3',
    component: () => import('./demos/demo3/index.vue'),
    meta: {
      desc: '交换元素动画',
    },
  },
  {
    path: '/demo4',
    component: () => import('./demos/demo4/index.vue'),
    meta: {
      desc: '给元素画边框',
    },
  },
  {
    path: '/demo5',
    component: () => import('./demos/mouseFollow/index.vue'),
    meta: {
      desc: 'MouseFollow',
    },
  },
]
