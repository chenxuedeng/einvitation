import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Pages from './modules/index'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    meta:{
      fullScreen: true,
    },
    component: () => import('/@/views/Home.vue'),
  },
  ...Pages,
  
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
