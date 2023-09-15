import { type RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { routes } from '@/router/router.config'
import { useDocumentTitle } from '@/hooks/useCommon'

NProgress.configure({
  showSpinner: false,
  parent: '#app',
})

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    showNavBar?: boolean
    title?: string
    noCache?: boolean
    oauth?: boolean
  }
}

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes,
})

router.beforeEach((_to: toRouteType, _from, next) => {
  NProgress.start() // start progress bar
  // 设置文档标题
  useDocumentTitle(_to.meta?.title)
  next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// 导出路由实例，并在 `main.ts` 挂载
export default router
