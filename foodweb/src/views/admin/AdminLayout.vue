<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { ElMessageBox } from 'element-plus'
import TagsView from '@/components/admin/TagsView.vue'
import {
  Menu as IconMenu,
  House as IconHouse,
  User as IconUser,
  List as IconList,
  Food as IconFood,
  Setting as IconSetting,
  ArrowRight as IconArrowRight,
  SwitchButton as IconSwitch,
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

// 侧边栏折叠状态
const isCollapse = ref(false)
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 展示用户名
const username = computed(() => userStore.userInfo?.username || '管理员')
const userAvatar = computed(() => {
  return username.value.charAt(0).toUpperCase()
})

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确认退出登录?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.logout()
      router.push('/login')
    })
    .catch(() => {})
}

// 返回前台
const goToFrontend = () => {
  router.push('/')
}

// 提供折叠状态给子组件
provide('sidebarCollapsed', isCollapse)
</script>

<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside class="sidebar" :width="isCollapse ? '64px' : '220px'">
      <div class="logo-container">
        <h2 v-if="!isCollapse">后台管理</h2>
        <el-icon v-else class="logo-icon"><IconSetting /></el-icon>
      </div>
      <el-menu
        default-active="/admin"
        class="sidebar-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
        :unique-opened="true"
        background-color="var(--background-soft)"
        text-color="var(--text-color)"
        active-text-color="var(--primary-color)"
      >
        <el-menu-item index="/admin">
          <el-icon><IconHouse /></el-icon>
          <span>控制面板</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><IconUser /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/categories">
          <el-icon><IconList /></el-icon>
          <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/dishes">
          <el-icon><IconFood /></el-icon>
          <span>菜品管理</span>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-footer">
        <el-tooltip effect="dark" :content="isCollapse ? '展开菜单' : '折叠菜单'" placement="right">
          <el-button text class="collapse-btn" @click="toggleSidebar">
            <el-icon :class="{ 'rotate-180': !isCollapse }"><IconArrowRight /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </el-aside>

    <!-- 主要内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <el-button type="primary" link @click="goToFrontend" class="back-btn">
            <el-icon><IconArrowRight class="rotate-180" /></el-icon>
            返回前台
          </el-button>
        </div>
        <div class="header-right">
          <el-tooltip content="切换主题" effect="dark" placement="bottom">
            <el-button text circle @click="themeStore.toggleTheme" class="theme-toggle">
              <el-icon><IconSwitch /></el-icon>
            </el-button>
          </el-tooltip>

          <el-dropdown trigger="click">
            <div class="user-dropdown">
              <el-avatar :size="32" class="avatar">{{ userAvatar }}</el-avatar>
              <span class="username">{{ username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 标签页视图 -->
      <tags-view />

      <!-- 内容区 -->
      <el-main class="content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="[]">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

.sidebar {
  background-color: var(--background-soft);
  height: 100%;
  transition: width 0.3s;
  box-shadow: 2px 0 10px var(--shadow-color);
  position: relative;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--border-color);
}

.logo-container h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--primary-color);
  white-space: nowrap;
  background: linear-gradient(to right, var(--primary-color), #42b983);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
}

.sidebar-footer {
  border-top: 1px solid var(--border-color);
  padding: 10px;
  display: flex;
  justify-content: center;
}

.collapse-btn {
  color: var(--text-color);
}

.rotate-180 {
  transform: rotate(180deg);
}

.main-container {
  flex: 1;
  overflow: hidden;
  background-color: var(--background-color);
}

.header {
  background-color: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 8px var(--shadow-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 60px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
  font-weight: 500;
}

.header-right {
  gap: 20px;
}

.theme-toggle {
  color: var(--text-color);
  background-color: var(--background-soft);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.theme-toggle:hover {
  background-color: var(--border-color);
  transform: rotate(45deg);
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: var(--background-soft);
}

.avatar {
  background: linear-gradient(to right, var(--primary-color), #42b983);
  color: white;
  font-weight: 500;
}

.username {
  color: var(--text-color);
  font-weight: 500;
}

.content {
  padding: 1.5rem;
  overflow-y: auto;
  background-color: var(--background-mute);
  height: calc(100vh - 60px - 34px); /* 减去header和tags-view的高度 */
}

/* 美化滚动条 */
.content::-webkit-scrollbar,
.sidebar-menu::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.content::-webkit-scrollbar-track,
.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb,
.sidebar-menu::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover,
.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: var(--text-color-light);
}

@media (max-width: 768px) {
  .username {
    display: none;
  }

  .admin-layout {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .sidebar {
    width: 100% !important;
    height: auto;
  }

  .content {
    height: auto;
  }
}
</style>
