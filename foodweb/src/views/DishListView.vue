<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import dishService from '@/services/dishService'
import categoryService from '@/services/categoryService'
import DishCard from '@/components/dish/DishCard.vue'
import { Search } from '@element-plus/icons-vue'
import type { Dish, Category } from '@/types/api'

const route = useRoute()
const router = useRouter()

// 数据状态
const dishes = ref<Dish[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const total = ref(0)
const pageSize = ref(12)
const currentPage = ref(1)

// 搜索参数
const searchParams = reactive({
  title: '',
  categoryId: null as number | null,
})

// 从URL中获取查询参数
const initFromQuery = () => {
  const { title, categoryId, page } = route.query
  if (title) searchParams.title = title.toString()
  if (categoryId) searchParams.categoryId = Number(categoryId)
  if (page) currentPage.value = Number(page)
}

// 加载分类数据
const loadCategories = async () => {
  try {
    categories.value = await categoryService.getAllCategories()
  } catch (error) {
    console.error('获取分类列表失败', error)
    ElMessage.error('获取分类列表失败')
  }
}

// 加载菜品数据
const loadDishes = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
      title: searchParams.title,
      ...(searchParams.categoryId !== null ? { categoryId: searchParams.categoryId } : {}),
    }

    // 更新URL查询参数
    router.push({
      path: route.path,
      query: {
        ...(searchParams.title ? { title: searchParams.title } : {}),
        ...(searchParams.categoryId ? { categoryId: searchParams.categoryId.toString() } : {}),
        ...(currentPage.value > 1 ? { page: currentPage.value.toString() } : {}),
      },
    })

    const response = await dishService.searchDishes(params)
    dishes.value = response.content
    total.value = response.totalElements
  } catch (error) {
    console.error('获取菜品列表失败', error)
    ElMessage.error('获取菜品列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  loadDishes()
}

// 处理重置
const handleReset = () => {
  searchParams.title = ''
  searchParams.categoryId = null
  currentPage.value = 1
  loadDishes()
}

// 处理分类点击
const handleCategoryClick = (categoryId: number | null) => {
  searchParams.categoryId = categoryId
  currentPage.value = 1
  loadDishes()
}

// 页码改变处理
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadDishes()
}

// 每页条数改变
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadDishes()
}

// 监听路由变化
watch(
  () => route.query,
  () => {
    initFromQuery()
    loadDishes()
  },
)

// 初始化
onMounted(() => {
  initFromQuery()
  loadCategories()
  loadDishes()
})
</script>

<template>
  <div class="dish-list-page">
    <div class="page-header">
      <h1>美食发现</h1>
      <div class="subtitle">探索各种美食，找到适合您口味的佳肴</div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-card class="search-card">
        <div class="search-form">
          <div class="search-input">
            <el-input
              v-model="searchParams.title"
              placeholder="搜索菜品名称"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>

          <div class="filter-actions">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
      </el-card>

      <!-- 分类筛选 -->
      <div class="category-filter">
        <div class="category-title">分类:</div>
        <div class="category-list">
          <div
            class="category-item"
            :class="{ active: searchParams.categoryId === null }"
            @click="handleCategoryClick(null)"
          >
            全部
          </div>
          <div
            v-for="category in categories"
            :key="category.categoryId"
            class="category-item"
            :class="{ active: searchParams.categoryId === category.categoryId }"
            @click="handleCategoryClick(category.categoryId)"
          >
            {{ category.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 菜品列表 -->
    <div class="dish-list-container">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-container">
        <div class="skeleton-grid">
          <div v-for="i in pageSize" :key="i" class="skeleton-item">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="image" style="height: 200px; width: 100%" />
                <div style="padding: 14px">
                  <el-skeleton-item variant="h3" style="width: 70%" />
                  <div style="display: flex; justify-content: space-between; margin-top: 10px">
                    <el-skeleton-item variant="text" style="width: 30%" />
                    <el-skeleton-item variant="text" style="width: 30%" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>
      </div>

      <!-- 无数据状态 -->
      <el-empty
        v-else-if="dishes.length === 0"
        description="没有找到符合条件的菜品"
        :image-size="200"
      >
        <el-button @click="handleReset">重置筛选条件</el-button>
      </el-empty>

      <!-- 菜品列表 -->
      <div v-else class="dish-grid">
        <div v-for="dish in dishes" :key="dish.dishId" class="dish-item">
          <DishCard :dish="dish" />
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 36, 48]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dish-list-page {
  padding: 1rem 0;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--heading-color);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-color-light);
  font-size: 1.1rem;
}

.search-section {
  margin-bottom: 2rem;
}

.search-card {
  margin-bottom: 1rem;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
}

.category-filter {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-title {
  font-weight: 500;
  margin-right: 0.5rem;
  color: var(--heading-color);
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-item {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: var(--background-soft);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.category-item:hover {
  background-color: var(--primary-color-light);
}

.category-item.active {
  background-color: var(--primary-color);
  color: white;
}

.loading-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
}

.skeleton-item {
  border-radius: 12px;
  overflow: hidden;
}

.dish-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.dish-item {
  height: 100%;
}

.pagination-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .filter-actions {
    width: 100%;
    justify-content: space-between;
  }

  .category-filter {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
