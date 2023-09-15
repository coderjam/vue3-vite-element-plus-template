import { defineStore } from 'pinia'
import { localStorage } from '@/utils/local-storage'
import { STORAGE_TOKEN_KEY } from '@/store/mutation-type'

export const useAccountStore = defineStore('account', {
  state: () => {
    return {
      isAuth: false, // 授权
      token: '', // token信息
    }
  },
  // 所有数据持久化
  // persist: true,
  // 持久化存储插件其他配置
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'store_persisted_account',
    // 修改为 sessionStorage，默认为 localStorage
    storage: window.localStorage,
    // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
    paths: ['token', 'isAuth'],
  },
  getters: {
    getToken() {
      return useAccountStore().token
    },
  },
  actions: {
    updateStoreToken(token: any) {
      this.token = token
    },
    // 更新授权状态
    updateStoreIsAuth(status: boolean) {
      this.isAuth = status
    },
    // 退出登录，清除登录信息
    layout() {
      localStorage.remove(STORAGE_TOKEN_KEY)
      this.updateStoreToken('')
      this.updateStoreIsAuth(false)
    },
  },
})
