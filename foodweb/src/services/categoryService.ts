import { request } from './request'
import type { Category } from '@/types/api'

export default {
  // 获取所有分类
  getAllCategories() {
    return request<Category[]>({
      url: '/api/admin/category',
      method: 'get',
    })
  },

  // 根据ID获取分类
  getCategoryById(categoryId: number) {
    return request<Category>({
      url: `/api/admin/category/${categoryId}`,
      method: 'get',
    })
  },

  // 添加分类（管理员功能）
  addCategory(name: string) {
    return request({
      url: '/api/admin/category',
      method: 'post',
      data: { name },
    })
  },

  // 修改分类（管理员功能）
  updateCategory(categoryId: number, name: string) {
    return request({
      url: '/api/admin/category',
      method: 'put',
      data: { categoryId, name },
    })
  },

  // 删除分类（管理员功能）
  deleteCategory(categoryId: number) {
    return request({
      url: `/api/admin/category/${categoryId}`,
      method: 'delete',
    })
  },
}
