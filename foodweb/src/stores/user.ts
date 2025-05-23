import { defineStore } from 'pinia'
import { ref } from 'vue'
import userService from '@/services/userService'
import type { LoginRequest, User } from '@/types/api'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref<boolean>(false)

  // 初始化状态
  const initUserState = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('userInfo')

    if (storedToken) {
      token.value = storedToken
    }

    if (storedUser) {
      try {
        userInfo.value = JSON.parse(storedUser)
      } catch (error) {
        userInfo.value = null
        localStorage.removeItem('userInfo')
      }
    }
  }

  // 登录
  const login = async (loginData: LoginRequest) => {
    loading.value = true
    try {
      const res = await userService.login(loginData)
      token.value = res.token
      userInfo.value = {
        userId: res.userId,
        username: res.username,
        role: res.role as 'ADMIN' | 'USER',
        email: '',
      }

      // 保存到本地存储
      localStorage.setItem('token', res.token)
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))

      ElMessage.success('登录成功')
      return true
    } catch (error) {
      if (error instanceof Error) {
        ElMessage.error(error.message || '登录失败')
      } else {
        ElMessage.error('登录失败')
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // 注销
  const logout = () => {
    userInfo.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.success('已退出登录')
  }

  // 是否已登录
  const isLoggedIn = () => {
    return !!token.value
  }

  // 是否为管理员
  const isAdmin = () => {
    return userInfo.value?.role === 'ADMIN'
  }

  // 获取用户ID
  const getUserId = () => {
    return userInfo.value?.userId
  }

  return {
    userInfo,
    token,
    loading,
    initUserState,
    login,
    logout,
    isLoggedIn,
    isAdmin,
    getUserId,
  }
})
