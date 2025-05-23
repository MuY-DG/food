<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import dishService from '@/services/dishService'
import MarkdownPreview from '@/components/common/MarkdownPreview.vue'
import type { Dish } from '@/types/api'

const route = useRoute()
const router = useRouter()
const dishId = ref(Number(route.params.id))
const dish = ref<Dish | null>(null)
const loading = ref(true)
const relatedDishes = ref<Dish[]>([])

// 加载菜品详情
const loadDishDetail = async () => {
  loading.value = true
  try {
    dish.value = await dishService.getDishById(dishId.value)
    if (dish.value.categoryId) {
      loadRelatedDishes(dish.value.categoryId)
    }
  } catch (error) {
    ElMessage.error('获取菜品详情失败')
    console.error('获取菜品详情失败', error)
    router.push('/')
  } finally {
    loading.value = false
  }
}

// 加载相关菜品
const loadRelatedDishes = async (categoryId: number) => {
  try {
    const response = await dishService.searchDishes({
      categoryId,
      page: 0,
      size: 4,
    })
    relatedDishes.value = response.content.filter((item) => item.dishId !== dishId.value)
  } catch (error) {
    console.error('获取相关菜品失败', error)
  }
}

onMounted(() => {
  loadDishDetail()
})
</script>

<template>
  <div class="dish-detail">
    <div v-if="loading" class="loading">
      <el-skeleton style="width: 100%" animated>
        <template #template>
          <div style="padding: 14px">
            <el-skeleton-item variant="h1" style="width: 60%" />
            <div style="display: flex; align-items: center; margin: 16px 0">
              <el-skeleton-item variant="text" style="margin-right: 16px; width: 100px" />
              <el-skeleton-item variant="text" style="width: 100px" />
            </div>
            <el-skeleton-item variant="image" style="width: 100%; height: 400px" />
            <el-skeleton-item variant="p" style="width: 100%; margin-top: 16px" />
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
          </div>
        </template>
      </el-skeleton>
    </div>

    <div v-else-if="dish" class="dish-content">
      <div class="dish-header">
        <h1>{{ dish.title }}</h1>
        <div class="dish-meta">
          <div class="category">分类: {{ dish.category?.name }}</div>
          <div class="author">作者: {{ dish.user?.username }}</div>
          <div class="date">发布时间: {{ new Date(dish.createdAt).toLocaleDateString() }}</div>
          <div class="clicks">浏览量: {{ dish.clicks }}</div>
        </div>
      </div>

      <div class="dish-image">
        <img :src="dish.coverImage" :alt="dish.title" />
      </div>

      <div class="dish-body">
        <MarkdownPreview :content="dish.markdownContent || ''" />
      </div>

      <div v-if="relatedDishes.length > 0" class="related-dishes">
        <h2>相关推荐</h2>
        <div class="related-grid">
          <RouterLink
            v-for="relatedDish in relatedDishes"
            :key="relatedDish.dishId"
            :to="`/dish/${relatedDish.dishId}`"
            class="related-item"
          >
            <div class="related-image">
              <img :src="relatedDish.coverImage" :alt="relatedDish.title" />
            </div>
            <div class="related-title">{{ relatedDish.title }}</div>
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <el-empty description="菜品不存在或已被删除" />
      <el-button type="primary" @click="router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.dish-detail {
  padding: 1rem 0;
}

.loading {
  padding: 2rem 0;
}

.dish-content {
  max-width: 900px;
  margin: 0 auto;
}

.dish-header {
  margin-bottom: 2rem;
}

.dish-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--heading-color);
}

.dish-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: var(--text-color-light);
  font-size: 0.9rem;
}

.category {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-weight: 500;
}

.clicks {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dish-image {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px var(--shadow-color);
}

.dish-image img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
}

.dish-body {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--shadow-color);
  margin-bottom: 2rem;
}

.related-dishes {
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.related-dishes h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--heading-color);
  position: relative;
}

.related-dishes h2::after {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
  margin-top: 0.5rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.related-item {
  text-decoration: none;
  color: var(--text-color);
  background: none;
  padding: 0;
  transition: transform 0.3s;
  display: block;
}

.related-item:hover {
  transform: translateY(-5px);
}

.related-image {
  border-radius: 8px;
  overflow: hidden;
  height: 120px;
  margin-bottom: 0.5rem;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-title {
  font-weight: 500;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.not-found {
  text-align: center;
  padding: 3rem 0;
}

@media (max-width: 768px) {
  .dish-header h1 {
    font-size: 1.8rem;
  }

  .dish-body {
    padding: 1.5rem;
  }

  .dish-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
