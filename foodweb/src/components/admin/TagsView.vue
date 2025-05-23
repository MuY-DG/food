<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsStore, type TagView } from '@/stores/tags'
import { Close } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const tagsStore = useTagsStore()

// 获取访问过的视图
const visitedViews = computed(() => tagsStore.visitedViews)

// 当前选中的标签
const selectedTag = ref({} as TagView)

// 将当前路由添加到标签页中
const addViewTags = () => {
  const { name, path, meta, fullPath } = route
  if (name) {
    tagsStore.addView({
      path: path,
      name: name as string,
      title: meta.title as string,
      fullPath: fullPath,
    })
  }
}

// 监听当前路由的变化
watch(
  () => route,
  () => {
    addViewTags()
    // 设置当前选中的标签
    for (const view of visitedViews.value) {
      if (view.path === route.path) {
        selectedTag.value = view
        break
      }
    }
  },
  { immediate: true, deep: true },
)

const isActive = (view: TagView) => {
  return view.path === route.path
}

// 关闭标签页
const closeSelectedTag = (view: TagView) => {
  tagsStore.closeAndNavigate(view)
}

// 关闭其他标签页
const closeOthersTags = () => {
  tagsStore.delOthersViews(selectedTag.value)
  if (selectedTag.value.path !== route.path) {
    router.push(selectedTag.value.path)
  }
}

// 关闭所有标签页
const closeAllTags = () => {
  tagsStore.delAllViews()
  router.push('/admin')
}

// 点击标签页切换路由
const handleClick = (view: TagView) => {
  if (view.path === route.path) return
  router.push(view.path)
}

// 标签右键菜单相关
const visible = ref(false)
const top = ref(0)
const left = ref(0)

const openMenu = (tag: TagView, e: MouseEvent) => {
  e.preventDefault()
  selectedTag.value = tag
  visible.value = true
  top.value = e.clientY
  left.value = e.clientX
}

const closeMenu = () => {
  visible.value = false
}

// 监听点击事件关闭右键菜单
onMounted(() => {
  document.addEventListener('click', () => {
    closeMenu()
  })
})
</script>

<template>
  <div class="tags-view-container" @click="closeMenu">
    <div class="tags-view-wrapper">
      <div class="scroll-container">
        <div
          class="tags-view-item"
          v-for="tag in visitedViews"
          :key="tag.path"
          :class="isActive(tag) ? 'active' : ''"
          @click="handleClick(tag)"
          @contextmenu.prevent="openMenu(tag, $event)"
        >
          {{ tag.title }}
          <el-icon class="close-icon" @click.stop="closeSelectedTag(tag)">
            <Close />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div v-show="visible" class="contextmenu" :style="{ top: top + 'px', left: left + 'px' }">
      <ul>
        <li @click="handleClick(selectedTag)">打开</li>
        <li @click="closeSelectedTag(selectedTag)">关闭</li>
        <li @click="closeOthersTags">关闭其他</li>
        <li @click="closeAllTags">关闭所有</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 3px 0 var(--shadow-color);
  position: relative;
}

.tags-view-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-color);
  background: var(--background-soft);
  padding: 0 10px;
  font-size: 12px;
  margin-right: 5px;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.tags-view-item:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.tags-view-item.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.close-icon {
  margin-left: 6px;
  width: 16px;
  height: 16px;
  font-size: 12px;
  vertical-align: middle;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  border-radius: 50%;
  padding: 1px;
}

.close-icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.tags-view-item.active .close-icon {
  color: white;
}

.tags-view-item.active .close-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.contextmenu {
  margin: 0;
  background: var(--card-background);
  z-index: 3000;
  position: fixed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 var(--shadow-color);
}

.contextmenu ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.contextmenu ul li {
  margin: 0;
  padding: 8px 16px;
  font-size: 12px;
  cursor: pointer;
  color: var(--text-color);
  transition: background 0.3s;
}

.contextmenu ul li:hover {
  background: var(--background-soft);
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .tags-view-container {
    height: 40px;
  }
}
</style>
