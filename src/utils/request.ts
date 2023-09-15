import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { localStorage } from '@/utils/local-storage'
import { STORAGE_TOKEN_KEY } from '@/store/mutation-type'
import { useAccountStore } from '@/store'

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'X-Access-Token'

// 授权登录状态
let isAuthing = false

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VITE_APP_BASE_API,
  timeout: 20000, // 请求超时时间
})

export type RequestError = AxiosError<{
  code?: number
  message?: string
  result?: any
  success?: boolean
}>

// 请求拦截器
const requestHandler = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
  const savedToken = localStorage.get(STORAGE_TOKEN_KEY)
  // 如果 token 存在
  // 让每个请求携带自定义 token, 请根据实际情况修改
  savedToken && (config.headers[REQUEST_TOKEN_KEY] = savedToken)
  return {
    ...{
      isInterceptor: true, // 标识是否是拦截器发起的请求
    },
    ...config,
  }
}

// 异常拦截处理器
const errorHandler = (error: RequestError): Promise<any> => {
  const useStore = useAccountStore()
  const { response, message } = error
  if (response) {
    const { status } = response
    switch (status) {
      case 403:
        // 403 无权限
        break
      case 401:
        // 401 未登录or登录过期
        useStore.layout()
        if (!isAuthing) {
          isAuthing = true
          // 跳转到登录页
        }
        break
      default:
        // 服务升级中，请稍后再试！

        break
    }
  } else {
    // 请求超时或者网络有问题
    if (message.includes('timeout')) {
      // 请求超时
    } else {
      // 断网，可以展示断网组件
    }
  }
  return Promise.reject(error)
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
const responseHandler = (response: { data: any; config: any }) => {
  const { code } = response?.data
  const { isInterceptor } = response?.config
  if (isInterceptor) {
    if (code >= 200 && code < 400) {
      if (code === 200) {
        return response.data
      } else {
        return Promise.reject(response.data)
      }
    } else {
      return response.data
    }
  } else {
    return response.data
  }
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

const http = {
  get<T = any>(url: string, params = {}, config?: any): Promise<T> {
    return request({ url, params, ...config, method: 'GET' })
  },
  post<T = any>(url: string, data = {}, config?: any): Promise<T> {
    return request({ url, data, ...config, method: 'POST' })
  },
  put<T = any>(url: string, data = {}, config?: any): Promise<T> {
    return request({ url, data, ...config, method: 'PUT' })
  },
  delete<T = any>(url: string, data = {}, config?: any): Promise<T> {
    return request({ url, data, ...config, method: 'DELETE' })
  },
  // 上传文件，指定 'Content-Type': 'multipart/form-data'
  upload<T = any>(url: string, data = {}, config?: any): Promise<T> {
    return request({
      url,
      data,
      ...config,
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default http
