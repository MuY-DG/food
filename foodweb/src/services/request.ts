import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 未授权，清除token并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// 通用请求方法
export const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await instance(config)
    const result = response.data as ApiResponse<T>
    if (result.code !== 200) {
      throw new Error(result.message || '请求失败')
    }
    return result.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('未知错误')
  }
}

export default instance
