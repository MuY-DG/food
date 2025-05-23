<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { ElDropdown, ElButton, ElIcon } from 'element-plus'
import { Moon, Sunny, User, ArrowDown } from '@element-plus/icons-vue'
import categoryService from '@/services/categoryService'
import type { Category } from '@/types/api'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

// 加载分类数据
const categories = ref<Category[]>([])
const loadingCategories = ref(false)

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    categories.value = await categoryService.getAllCategories()
  } catch (error) {
    console.error('获取分类失败', error)
  } finally {
    loadingCategories.value = false
  }
}

fetchCategories()

// 处理登出
const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

// 计算属性，用于显示用户名或登录按钮
const userDisplay = computed(() => {
  return userStore.isLoggedIn() ? userStore.userInfo?.username : '登录'
})

// 切换主题
const toggleTheme = () => {
  themeStore.toggleTheme()
}

// 用户按钮点击
const handleUserButtonClick = () => {
  if (!userStore.isLoggedIn()) {
    router.push('/login')
  }
}

// 用户菜单点击
const handleCommand = (command: string) => {
  if (command === 'logout') {
    handleLogout()
  } else if (command === 'admin') {
    router.push('/admin')
  }
}
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <RouterLink to="/">
          <h1>美食推荐</h1>
        </RouterLink>
      </div>

      <nav class="nav-menu">
        <RouterLink to="/" class="nav-item">首页</RouterLink>
        <RouterLink to="/dishes" class="nav-item">美食发现</RouterLink>
        <RouterLink to="/about" class="nav-item">关于</RouterLink>
      </nav>

      <div class="actions">
        <el-button
          circle
          @click="toggleTheme"
          class="theme-toggle"
          :title="themeStore.isDark ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <el-icon>
            <Moon v-if="!themeStore.isDark" />
            <Sunny v-else />
          </el-icon>
        </el-button>

        <!-- 已登录用户显示下拉菜单，未登录用户点击直接跳转登录页 -->
        <el-button
          v-if="!userStore.isLoggedIn()"
          type="primary"
          class="user-dropdown"
          @click="handleUserButtonClick"
        >
          <el-icon style="margin-right: 6px"><user /></el-icon>
          {{ userDisplay }}
        </el-button>

        <el-dropdown v-else trigger="click" @command="handleCommand">
          <el-button type="primary" class="user-dropdown">
            <el-icon style="margin-right: 6px"><user /></el-icon>
            {{ userDisplay }}
            <el-icon><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-if="userStore.isLoggedIn() && userStore.isAdmin()"
                command="admin"
              >
                后台管理
              </el-dropdown-item>
              <el-dropdown-item v-if="userStore.isLoggedIn()" command="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--background-color);
  box-shadow: 0 2px 8px var(--shadow-color);
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0.5rem 0;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 60px;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 600;
  background: linear-gradient(to right, var(--primary-color), #42b983);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.logo a {
  background: none;
  padding: 0;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-item {
  color: var(--text-color);
  font-weight: 500;
  position: relative;
  padding: 0.5rem 0;
  cursor: pointer;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-item:hover::after,
.router-link-active::after {
  width: 100%;
}

.categories-dropdown {
  display: flex;
  align-items: center;
  gap: 4px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  color: var(--text-color);
  background: var(--background-soft);
  border: 1px solid var(--border-color);
  transition: all 0.3s;
}

.theme-toggle:hover {
  border-color: var(--primary-color);
}

.user-dropdown {
  display: flex;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    padding: 0.5rem;
    height: auto;
  }

  .logo {
    order: 1;
    flex: 1;
  }

  .actions {
    order: 2;
  }

  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .logo h1 {
    font-size: 1.4rem;
  }
}
</style>
