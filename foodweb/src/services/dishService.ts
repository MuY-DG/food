import { request } from './request'
import type { Dish, DishRequest, PageResponse } from '@/types/api'

export default {
  // 获取所有菜品
  getAllDishes() {
    return request<Dish[]>({
      url: '/api/admin/dish',
      method: 'get',
    })
  },

  // 根据ID获取菜品
  getDishById(dishId: number) {
    return request<Dish>({
      url: `/api/admin/dish/${dishId}`,
      method: 'get',
    })
  },

  // 分页查询菜品
  searchDishes(params: { page?: number; size?: number; title?: string; categoryId?: number }) {
    return request<PageResponse<Dish>>({
      url: '/api/admin/dish/search',
      method: 'get',
      params,
    })
  },

  // 获取热门菜品
  getHotDishes() {
    return request<Dish[]>({
      url: '/api/admin/dish/hot',
      method: 'get',
    })
  },

  // 添加菜品（管理员功能）
  addDish(dish: DishRequest) {
    return request({
      url: '/api/admin/dish',
      method: 'post',
      data: dish,
    })
  },

  // 修改菜品（管理员功能）
  updateDish(dish: DishRequest) {
    return request({
      url: '/api/admin/dish',
      method: 'put',
      data: dish,
    })
  },

  // 删除菜品（管理员功能）
  deleteDish(dishId: number) {
    return request({
      url: `/api/admin/dish/${dishId}`,
      method: 'delete',
    })
  },
}
