import { request } from './request'
import type { LoginRequest, LoginResponse, RegisterRequest, User, PageResponse } from '@/types/api'

export default {
  // 用户登录
  login(data: LoginRequest) {
    return request<LoginResponse>({
      url: '/api/user/login',
      method: 'post',
      data,
    })
  },

  // 用户注册
  register(data: { user: RegisterRequest; verificationCode: string }) {
    return request<User>({
      url: '/api/user/register',
      method: 'post',
      data,
    })
  },

  // 发送验证码
  sendVerificationCode(email: string) {
    return request<{ message: string }>({
      url: '/api/user/code',
      method: 'post',
      data: { email },
    })
  },

  // 根据ID获取用户信息
  getUserById(userId: number) {
    return request<User>({
      url: `/api/user/${userId}`,
      method: 'get',
    })
  },

  // 分页获取所有用户（管理员功能）
  getAllUsers(page = 0, size = 10) {
    return request<PageResponse<User>>({
      url: '/api/user/page',
      method: 'get',
      params: { page, size },
    })
  },
}
