<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { onMounted, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

// 导入Element Plus样式
import 'element-plus/dist/index.css'
// 导入暗色主题
import 'element-plus/theme-chalk/dark/css-vars.css'

// 初始化主题和用户状态
const themeStore = useThemeStore()
const userStore = useUserStore()

onMounted(() => {
  userStore.initUserState()
})

const route = useRoute()

// 检查当前路径是否为后台管理页面
const isAdminPage = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<template>
  <div class="app" :class="{ 'admin-mode': isAdminPage, 'dark-theme': themeStore.isDark }">
    <!-- 只在非管理页面显示头部和底部 -->
    <AppHeader v-if="!isAdminPage" />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter v-if="!isAdminPage" />
  </div>
</template>

<style>
/* 全局变量 */
:root {
  /* 亮色主题变量 */
  --primary-color: hsla(160, 100%, 37%, 1);
  --primary-color-light: hsla(160, 100%, 37%, 0.2);
  --background-color: #ffffff;
  --background-soft: #f8f8f8;
  --background-mute: #f2f2f2;
  --text-color: #2c3e50;
  --text-color-light: rgba(60, 60, 60, 0.66);
  --heading-color: #2c3e50;
  --border-color: rgba(60, 60, 60, 0.12);
  --border-color-hover: rgba(60, 60, 60, 0.29);
  --card-background: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.05);
}

/* 暗色主题变量 */
.dark-theme,
:root.dark {
  --primary-color: hsla(160, 100%, 50%, 1);
  --primary-color-light: hsla(160, 100%, 50%, 0.2);
  --background-color: #181818;
  --background-soft: #222222;
  --background-mute: #282828;
  --text-color: #f2f2f2;
  --text-color-light: rgba(235, 235, 235, 0.64);
  --heading-color: #ffffff;
  --border-color: rgba(84, 84, 84, 0.48);
  --border-color-hover: rgba(84, 84, 84, 0.65);
  --card-background: #222222;
  --shadow-color: rgba(0, 0, 0, 0.2);
}

/* 基础样式 */
body {
  min-height: 100vh;
  color: var(--text-color);
  background: var(--background-color);
  transition:
    color 0.5s,
    background-color 0.5s;
  line-height: 1.6;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-mode {
  height: 100vh;
  overflow: hidden;
}

.admin-mode .main-content {
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
}

/* 非管理页面内容宽度限制 */
.app:not(.admin-mode) .main-content {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

a {
  text-decoration: none;
  color: var(--primary-color);
  transition: 0.4s;
  padding: 3px;
}

@media (hover: hover) {
  a:hover {
    background-color: var(--primary-color-light);
  }
}

@media (min-width: 1024px) {
  .main-content {
    padding: 0 2rem;
  }
}
</style>
