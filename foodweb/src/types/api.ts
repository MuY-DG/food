// API 响应和请求类型定义

// 定义API响应的基本结构
export interface ApiResponse<T = any> {
  code: number
  message: string | null
  data: T
}

// 分页响应类型
export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  totalElements: number
  totalPages: number
}

// 用户相关类型
export interface User {
  userId: number
  username: string
  email: string
  phone?: string
  role: 'ADMIN' | 'USER'
  createdAt?: string
  updatedAt?: string
}

export interface LoginRequest {
  username: string
  passwordHash: string
}

export interface LoginResponse {
  token: string
  userId: number
  username: string
  role: string
}

// 注册请求参数
export interface RegisterRequest {
  username: string
  passwordHash: string
  email: string
  phone?: string
}

// 分类相关类型
export interface Category {
  categoryId: number
  name: string
  createdAt: number
  updatedAt: number
}

// 菜品相关类型
export interface Dish {
  dishId: number
  title: string
  coverImage: string
  markdownContent: string | null
  userId: number
  categoryId: number
  category?: Category
  user?: User
  createdAt: string
  updatedAt: string
  clicks: number // 点击量
}

export interface DishRequest {
  title: string
  coverImage: string
  markdownContent: string
  userId: number
  categoryId: number
  dishId?: number
}

// 文件上传响应
export interface FileUploadResponse {
  url: string
  filename: string
}

// 搜索参数类型
export interface DishSearchParams {
  title?: string
  categoryId?: number | null
  page: number
  size: number
}
