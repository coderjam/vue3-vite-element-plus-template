import { defineStore } from 'pinia'
import type { toRouteType } from '@/router'

export const useCachedViewStore = defineStore('cached-view', {
  state: () => {
    return {
      // 缓存页面 keepAlive
      cachedViewList: [] as string[],
    }
  },
  // 所有数据持久化
  // persist: true,
  // 持久化存储插件其他配置
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'store_persisted_cached_view',
    // 修改为 sessionStorage，默认为 localStorage
    storage: window.localStorage,
    // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
    paths: [],
  },
  getters: {

  },
  actions: {
    addCachedView(view: toRouteType) {
      // 不重复添加
      if (this.cachedViewList.includes(view.name as string)) {
        return
      }
      if (!view?.meta?.noCache) {
        this.cachedViewList.push(view.name as string)
      }
    },
    delCachedView(view: toRouteType) {
      const index = this.cachedViewList.indexOf(view.name as string)
      index > -1 && this.cachedViewList.splice(index, 1)
    },
    delAllCachedViews() {
      this.cachedViewList = [] as string[]
    },
  },
})
