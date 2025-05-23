<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import dishService from '@/services/dishService'
import DishCard from '@/components/dish/DishCard.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import type { Dish } from '@/types/api'

// 数据状态
const dishes = ref<Dish[]>([])
const loading = ref(true)

// 加载热门菜品
const loadHotDishes = async () => {
  loading.value = true
  try {
    dishes.value = await dishService.getHotDishes()
  } catch (error) {
    console.error('获取热门菜品失败', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载后加载数据
onMounted(() => {
  loadHotDishes()
})
</script>

<template>
  <div class="home">
    <!-- 头部 Banner -->
    <section class="hero">
      <div class="hero-content">
        <h1>发现美味，享受生活</h1>
        <p>探索各种美食推荐，找到适合您的味蕾享受</p>
      </div>
    </section>

    <!-- 美食列表 -->
    <section class="dishes-section">
      <h2>推荐美食</h2>
      <div v-if="loading" class="loading">
        <div class="skeleton-grid">
          <div v-for="i in 6" :key="i" class="skeleton-item">
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
      <div v-else-if="dishes.length === 0" class="empty-state">
        <el-empty description="暂无美食数据" />
      </div>
      <div v-else class="dishes-grid">
        <div v-for="dish in dishes" :key="dish.dishId" class="dish-item">
          <DishCard :dish="dish" />
        </div>
      </div>

      <!-- 查看更多美食按钮 -->
      <div class="view-more-container">
        <RouterLink to="/dishes" class="view-more-btn">
          <span>查看更多美食</span>
          <el-icon><ArrowRight /></el-icon>
        </RouterLink>
      </div>
    </section>

    <!-- 推荐内容 -->
    <section class="featured-section">
      <h2>探索美食文化</h2>
      <div class="feature-boxes">
        <div class="feature-box">
          <div class="feature-icon">🌍</div>
          <h3>世界各地美食</h3>
          <p>探索来自世界各地的特色菜肴和烹饪技巧</p>
        </div>
        <div class="feature-box">
          <div class="feature-icon">👨‍🍳</div>
          <h3>厨师推荐</h3>
          <p>由专业厨师推荐的独特食谱和制作技巧</p>
        </div>
        <div class="feature-box">
          <div class="feature-icon">🌱</div>
          <h3>健康饮食</h3>
          <p>关注营养均衡的健康美食选择</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  margin-top: -2rem; /* 抵消主容器的padding */
}

.hero {
  background: linear-gradient(135deg, var(--primary-color), #3a8ee6);
  color: white;
  text-align: center;
  padding: 5rem 1rem;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200')
    center/cover no-repeat;
  opacity: 0.2;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.dishes-section {
  margin-bottom: 3rem;
  padding: 0 1rem;
}

.dishes-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  position: relative;
  color: var(--heading-color);
}

.dishes-section h2::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
  margin-top: 0.5rem;
}

.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.dish-item {
  height: 100%;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.skeleton-item {
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
}

.empty-state {
  padding: 3rem;
  text-align: center;
}

.view-more-container {
  text-align: center;
  margin-top: 2rem;
}

.view-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.view-more-btn:hover {
  background-color: var(--primary-color-dark);
}

.featured-section {
  padding: 3rem 1rem;
  background-color: var(--background-soft);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.featured-section h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: var(--heading-color);
}

.feature-boxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-box {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px var(--shadow-color);
  transition: transform 0.3s;
}

.feature-box:hover {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-box h3 {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: var(--heading-color);
}

.feature-box p {
  color: var(--text-color-light);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .feature-boxes {
    grid-template-columns: 1fr;
  }
}
</style>
