<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElCard } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import dishService from '@/services/dishService'
import categoryService from '@/services/categoryService'
import userService from '@/services/userService'
import type { Dish, Category, User } from '@/types/api'

const router = useRouter()
const userStore = useUserStore()

// 统计数据
const loading = ref(true)
const dishCount = ref(0)
const categoryCount = ref(0)
const userCount = ref(0)
const latestDishes = ref<Dish[]>([])
const categories = ref<Category[]>([])

// 当前用户信息
const currentUser = computed(() => userStore.userInfo)

// 加载数据
const loadDashboardData = async () => {
  loading.value = true
  try {
    // 并行加载数据以提高性能
    const [dishResponse, categoryList, userResponse] = await Promise.all([
      dishService.searchDishes({ page: 0, size: 5 }),
      categoryService.getAllCategories(),
      userService.getAllUsers(0, 1), // 只需要获取总数
    ])

    latestDishes.value = dishResponse.content
    dishCount.value = dishResponse.totalElements

    categories.value = categoryList
    categoryCount.value = categoryList.length

    userCount.value = userResponse.totalElements
  } catch (error) {
    console.error('加载仪表盘数据失败', error)
  } finally {
    loading.value = false
  }
}

// 导航到功能区
const navigateTo = (path: string) => {
  router.push(path)
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 获取分类名称
const getCategoryName = (categoryId: number) => {
  const category = categories.value.find((item) => item.categoryId === categoryId)
  return category ? category.name : '-'
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="dashboard" v-loading="loading">
    <div class="welcome-section">
      <h2>欢迎回来，{{ currentUser?.username || '管理员' }}</h2>
      <p>今天是 {{ new Date().toLocaleDateString() }}，美食推荐平台管理系统</p>
    </div>

    <!-- 数据卡片 -->
    <div class="stat-cards">
      <el-card class="stat-card" shadow="hover" @click="navigateTo('/admin/dishes')">
        <div class="stat-value">{{ dishCount }}</div>
        <div class="stat-label">菜品总数</div>
        <div class="stat-icon">🍳</div>
      </el-card>

      <el-card class="stat-card" shadow="hover" @click="navigateTo('/admin/categories')">
        <div class="stat-value">{{ categoryCount }}</div>
        <div class="stat-label">分类总数</div>
        <div class="stat-icon">📋</div>
      </el-card>

      <el-card class="stat-card" shadow="hover" @click="navigateTo('/admin/users')">
        <div class="stat-value">{{ userCount }}</div>
        <div class="stat-label">用户总数</div>
        <div class="stat-icon">👥</div>
      </el-card>
    </div>

    <!-- 快捷操作 -->
    <div class="action-section">
      <h3>快捷操作</h3>
      <div class="action-buttons">
        <el-button type="primary" @click="navigateTo('/admin/dishes/add')"> 添加新菜品 </el-button>
        <el-button @click="navigateTo('/admin/categories')"> 管理分类 </el-button>
        <el-button @click="navigateTo('/')"> 访问前台 </el-button>
      </div>
    </div>

    <!-- 最新菜品 -->
    <div class="latest-section">
      <h3>最新添加的菜品</h3>
      <el-table :data="latestDishes" style="width: 100%" v-if="latestDishes.length > 0">
        <el-table-column label="菜品名称" prop="title" min-width="200" />
        <el-table-column label="分类" min-width="120">
          <template #default="{ row }">
            {{ getCategoryName(row.categoryId) }}
          </template>
        </el-table-column>
        <el-table-column label="封面" width="150">
          <template #default="{ row }">
            <el-image
              :src="row.coverImage"
              style="width: 80px; height: 50px"
              fit="cover"
              :preview-src-list="[row.coverImage]"
            />
          </template>
        </el-table-column>
        <el-table-column label="添加时间" min-width="120">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              text
              @click="navigateTo(`/admin/dishes/edit/${row.dishId}`)"
            >
              编辑
            </el-button>
            <el-button size="small" type="primary" text @click="navigateTo(`/dish/${row.dishId}`)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无菜品数据" />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  margin-bottom: 2rem;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-section h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: var(--heading-color);
}

.welcome-section p {
  color: var(--text-color-light);
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-color-light);
  font-size: 1rem;
}

.stat-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  opacity: 0.2;
}

.action-section {
  margin-bottom: 2rem;
}

.action-section h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--heading-color);
  position: relative;
}

.action-section h3::after {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
  margin-top: 0.5rem;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.latest-section {
  margin-bottom: 2rem;
}

.latest-section h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--heading-color);
  position: relative;
}

.latest-section h3::after {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
