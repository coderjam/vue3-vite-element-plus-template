import http from '@/utils/request'
import httpEnv2 from '@/utils/requestEnv2'

export const getTest = (): Promise<any> => {
  return http.get('/api/test')
}
export const getTestEnv2 = (params: any): Promise<any> => {
  return httpEnv2.get('/api/test/env2', params)
}