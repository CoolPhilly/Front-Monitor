import { createRouter, createWebHistory } from 'vue-router'
//表示导入的是一个类型
import type { RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
  { path: '/404',
    component: () => import('@/views/home/404.vue'),
    meta: { title: "404" } },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: "登录" }
  },
  {
    path: '/bigScreen',
    component: () => import('@/views/bigScreen/index.vue'),
    meta: { title: "可视化大屏" }
  }
]
const router = createRouter({
  routes,
  history: createWebHistory()
})

export default router
