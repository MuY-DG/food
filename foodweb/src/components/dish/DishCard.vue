<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Dish } from '@/types/api'

// 组件属性
const props = defineProps<{
  dish: Dish
}>()

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>

<template>
  <RouterLink :to="`/dish/${dish.dishId}`" class="dish-card">
    <div class="dish-image">
      <img :src="dish.coverImage" :alt="dish.title" />
    </div>
    <div class="dish-content">
      <h3 class="dish-title">{{ dish.title }}</h3>
      <div class="dish-meta">
        <div class="dish-category" v-if="dish.category">{{ dish.category.name }}</div>
        <div class="dish-date">{{ formatDate(dish.createdAt) }}</div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.dish-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px var(--shadow-color);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  background-color: var(--card-background);
  color: var(--text-color);
}

.dish-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 24px var(--shadow-color);
}

.dish-image {
  height: 200px;
  overflow: hidden;
}

.dish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.dish-card:hover .dish-image img {
  transform: scale(1.05);
}

.dish-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.dish-title {
  margin: 0 0 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--heading-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.dish-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  color: var(--text-color-light);
}

.dish-category {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.8rem;
}
</style>
