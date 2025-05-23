import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export interface TagView {
  path: string
  title: string
  name: string
  fullPath: string
  icon?: string
  fixed?: boolean
  meta?: {
    noCache?: boolean
  }
}

export const useTagsStore = defineStore('tags', () => {
  const router = useRouter()

  // 标签页列表
  const visitedViews = ref<TagView[]>([])

  // 缓存的组件名
  const cachedViews = ref<string[]>([])

  // 添加标签页
  const addView = (view: TagView) => {
    // 如果已经存在，则不重复添加
    if (visitedViews.value.some((v) => v.path === view.path)) return

    // 添加到已访问视图
    visitedViews.value.push(
      Object.assign({}, view, {
        title: view.title || '未命名页面',
      }),
    )

    // 如果组件可以被缓存，添加到缓存视图
    if (view.name && !view.meta?.noCache) {
      cachedViews.value.push(view.name)
    }
  }

  // 移除标签页
  const delView = (view: TagView) => {
    // 移除已访问视图
    for (const [i, v] of visitedViews.value.entries()) {
      if (v.path === view.path) {
        visitedViews.value.splice(i, 1)
        break
      }
    }

    // 移除缓存视图
    if (view.name) {
      const index = cachedViews.value.indexOf(view.name)
      if (index > -1) {
        cachedViews.value.splice(index, 1)
      }
    }
  }

  // 关闭其他标签页
  const delOthersViews = (view: TagView) => {
    visitedViews.value = visitedViews.value.filter((v) => {
      return v.fixed || v.path === view.path
    })

    // 只保留当前视图的缓存
    cachedViews.value = cachedViews.value.filter((name) => {
      return name === view.name
    })
  }

  // 关闭所有标签页
  const delAllViews = () => {
    // 保留固定标签
    visitedViews.value = visitedViews.value.filter((tag) => tag.fixed)
    cachedViews.value = []
  }

  // 关闭标签页并导航
  const closeAndNavigate = (view: TagView) => {
    // 先删除标签
    delView(view)

    // 如果还有其他标签，导航到最后一个标签
    if (visitedViews.value.length > 0) {
      router.push(visitedViews.value[visitedViews.value.length - 1].fullPath)
    } else {
      // 否则导航到管理首页
      router.push('/admin')
    }
  }

  return {
    visitedViews,
    cachedViews,
    addView,
    delView,
    delOthersViews,
    delAllViews,
    closeAndNavigate,
  }
})
