import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  // 检测系统是否处于深色模式
  const systemDarkMode = usePreferredDark()
  // 获取本地存储的主题偏好，如果没有则使用系统偏好
  const storedTheme = localStorage.getItem('theme')

  // 状态
  const isDark = ref(storedTheme ? storedTheme === 'dark' : systemDarkMode.value)

  // 设置主题到HTML元素
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  // 监听主题变化
  watch(
    isDark,
    () => {
      applyTheme()
    },
    { immediate: true },
  )

  // 系统主题改变时更新
  watch(systemDarkMode, (newValue) => {
    // 只有当用户没有设置过主题时才跟随系统
    if (!localStorage.getItem('theme')) {
      isDark.value = newValue
    }
  })

  return {
    isDark,
    toggleTheme,
  }
})
