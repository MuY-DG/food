import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 前台页面
import HomeView from '@/views/HomeView.vue'
import DishDetailView from '@/views/DishDetailView.vue'
import DishListView from '@/views/DishListView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AboutView from '@/views/AboutView.vue'

// 后台页面
import AdminLayout from '@/views/admin/AdminLayout.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import UsersManageView from '@/views/admin/UsersManageView.vue'
import CategoriesManageView from '@/views/admin/CategoriesManageView.vue'
import DishesManageView from '@/views/admin/DishesManageView.vue'
import DishEditView from '@/views/admin/DishEditView.vue'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 前台页面路由
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首页 - 美食推荐平台' },
    },
    {
      path: '/dishes',
      name: 'dish-list',
      component: DishListView,
      meta: { title: '美食发现 - 美食推荐平台' },
    },
    {
      path: '/dish/:id',
      name: 'dish-detail',
      component: DishDetailView,
      meta: { title: '菜品详情 - 美食推荐平台' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: '登录 - 美食推荐平台', guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: '注册 - 美食推荐平台', guest: true },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { title: '关于我们 - 美食推荐平台' },
    },

    // 后台管理路由 - 作为独立页面
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, isAdmin: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
          meta: { title: '控制面板 - 美食推荐平台管理系统' },
        },
        {
          path: 'users',
          name: 'users-manage',
          component: UsersManageView,
          meta: { title: '用户管理 - 美食推荐平台管理系统' },
        },
        {
          path: 'categories',
          name: 'categories-manage',
          component: CategoriesManageView,
          meta: { title: '分类管理 - 美食推荐平台管理系统' },
        },
        {
          path: 'dishes',
          name: 'dishes-manage',
          component: DishesManageView,
          meta: { title: '菜品管理 - 美食推荐平台管理系统' },
        },
        {
          path: 'dishes/add',
          name: 'dish-add',
          component: DishEditView,
          meta: { title: '添加菜品 - 美食推荐平台管理系统' },
        },
        {
          path: 'dishes/edit/:id',
          name: 'dish-edit',
          component: DishEditView,
          meta: { title: '编辑菜品 - 美食推荐平台管理系统' },
        },
      ],
    },

    // 404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const userStore = useUserStore()

  // 验证用户权限
  if (to.meta.requiresAuth && !userStore.isLoggedIn()) {
    // 如果需要登录但用户未登录，重定向到登录页
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
  // 验证管理员权限
  else if (to.meta.isAdmin && !userStore.isAdmin()) {
    // 如果需要管理员权限但用户不是管理员，重定向到首页
    next({ name: 'home' })
  }
  // 已登录用户尝试访问登录/注册页
  else if (to.meta.guest && userStore.isLoggedIn()) {
    // 已登录用户尝试访问登录页或注册页，重定向到首页
    next({ name: 'home' })
  } else {
    // 正常导航
    next()
  }
})

export default router
