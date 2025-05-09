import type { RouteRecordRaw } from 'vue-router'
import Index from '@/views/index/index.vue'
import Layout from '@/layout/index.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/', // 路由地址
    name: 'tabBar', // 路由名称
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'tabBarIndex',
        component: Index,
        meta: {
          title: '首页',
          oauth: false,
          noCache: true,
          showNavBar: false,
        },
      }],
  },
  { path: '/:pathMatch(.*)*', redirect: '/index' },
]
