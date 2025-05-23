<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dishService from '@/services/dishService'
import categoryService from '@/services/categoryService'
import MarkdownPreview from '@/components/common/MarkdownPreview.vue'
import { Plus, Delete, Edit, View, Search, RefreshRight, Filter } from '@element-plus/icons-vue'
import type { Dish, Category, PageResponse } from '@/types/api'

const router = useRouter()
const loading = ref(false)
const dishes = ref<Dish[]>([])
const categories = ref<Category[]>([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const dialogVisible = ref(false)
const previewDish = ref<Dish | null>(null)

// 搜索参数
const searchParams = reactive({
  title: '',
  categoryId: null as number | null,
})

// 高级筛选选项
const showFilter = ref(false)

// 加载菜品列表
const loadDishes = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
      title: searchParams.title,
      categoryId: searchParams.categoryId ?? undefined,
    }

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

// 加载分类列表
const loadCategories = async () => {
  try {
    categories.value = await categoryService.getAllCategories()
  } catch (error) {
    console.error('获取分类列表失败', error)
    ElMessage.error('获取分类列表失败')
  }
}

// 获取分类名称
const getCategoryName = (categoryId: number) => {
  const category = categories.value.find((item) => item.categoryId === categoryId)
  return category ? category.name : '-'
}

// 预览菜品
const previewDishContent = (dish: Dish) => {
  previewDish.value = dish
  dialogVisible.value = true
}

// 编辑菜品
const editDish = (dishId: number) => {
  router.push(`/admin/dishes/edit/${dishId}`)
}

// 添加菜品
const addDish = () => {
  router.push('/admin/dishes/add')
}

// 删除菜品
const deleteDish = (dishId: number) => {
  ElMessageBox.confirm('确认删除该菜品？此操作不可恢复', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await dishService.deleteDish(dishId)
        ElMessage.success('删除成功')
        // 重新加载数据
        if (dishes.value.length === 1 && currentPage.value > 1) {
          currentPage.value--
        }
        loadDishes()
      } catch (error) {
        console.error('删除失败', error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
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
  showFilter.value = false
  currentPage.value = 1
  loadDishes()
}

// 页码改变
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

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 截取内容摘要
const getContentSummary = (content: string | null) => {
  if (!content) return '-'
  if (content.length <= 50) return content
  return content.slice(0, 50) + '...'
}

// 根据分类过滤的状态
const categoryFilterActive = computed(() => searchParams.categoryId !== null)

// 组件初始化
onMounted(() => {
  loadCategories()
  loadDishes()
})
</script>

<template>
  <div class="dish-manage">
    <div class="page-header">
      <div class="header-info">
        <h2>菜品管理</h2>
        <p class="description">管理系统中的菜品，添加、编辑或删除菜品信息。</p>
      </div>
      <el-button type="primary" @click="addDish" :icon="Plus">添加菜品</el-button>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <div class="search-container">
        <el-input
          v-model="searchParams.title"
          placeholder="搜索菜品标题"
          clearable
          @keyup.enter="handleSearch"
          :prefix-icon="Search"
          class="search-input"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>

        <el-tooltip content="高级筛选" effect="dark" placement="top">
          <el-button
            :icon="Filter"
            :type="categoryFilterActive ? 'primary' : ''"
            @click="showFilter = !showFilter"
            circle
          />
        </el-tooltip>

        <el-button :icon="RefreshRight" @click="handleReset" circle title="重置" />
      </div>

      <!-- 展开的筛选项 -->
      <div v-if="showFilter" class="filter-options">
        <el-form :inline="true" :model="searchParams" class="filter-form">
          <el-form-item label="所属分类">
            <el-select v-model="searchParams.categoryId" placeholder="全部分类" clearable>
              <el-option
                v-for="category in categories"
                :key="category.categoryId"
                :label="category.name"
                :value="category.categoryId"
              />
            </el-select>
          </el-form-item>
          <!-- 可以添加更多筛选条件 -->
        </el-form>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="data-card" v-loading="loading">
      <el-table
        :data="dishes"
        style="width: 100%"
        border
        stripe
        highlight-current-row
        row-key="dishId"
      >
        <el-table-column label="ID" prop="dishId" width="80" />
        <el-table-column label="标题" prop="title" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="dish-title">{{ row.title }}</div>
            <div class="dish-category">分类: {{ getCategoryName(row.categoryId) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="封面" width="150">
          <template #default="{ row }">
            <el-image
              :src="row.coverImage"
              style="width: 100px; height: 60px"
              fit="cover"
              :preview-src-list="[row.coverImage]"
              class="dish-cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button
                size="small"
                type="primary"
                :icon="View"
                circle
                @click="previewDishContent(row)"
                title="预览"
              />
              <el-button
                size="small"
                type="warning"
                :icon="Edit"
                circle
                @click="editDish(row.dishId)"
                title="编辑"
              />
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                circle
                @click="deleteDish(row.dishId)"
                title="删除"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="dishes.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无菜品数据" />
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="菜品详情预览"
      width="70%"
      destroy-on-close
      class="dish-preview-dialog"
    >
      <el-tabs v-if="previewDish">
        <el-tab-pane label="基本信息">
          <div class="preview-info">
            <h3>{{ previewDish.title }}</h3>
            <div class="preview-meta">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="菜品ID">{{ previewDish.dishId }}</el-descriptions-item>
                <el-descriptions-item label="分类">{{
                  getCategoryName(previewDish.categoryId)
                }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{
                  formatDate(previewDish.createdAt)
                }}</el-descriptions-item>
                <el-descriptions-item label="更新时间">{{
                  formatDate(previewDish.updatedAt)
                }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="preview-image">
              <el-image
                :src="previewDish.coverImage"
                fit="contain"
                :preview-src-list="[previewDish.coverImage]"
                class="preview-cover"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="菜品内容">
          <div class="preview-content">
            <MarkdownPreview :content="previewDish.markdownContent || ''" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="editDish(previewDish?.dishId!)">编辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.dish-manage {
  margin-bottom: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.header-info h2 {
  margin: 0;
  font-size: 1.6rem;
  color: var(--heading-color);
  margin-bottom: 0.5rem;
}

.description {
  color: var(--text-color-light);
  margin: 0;
}

.search-card {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 var(--shadow-color);
  transition: box-shadow 0.3s;
}

.search-card:hover,
.data-card:hover {
  box-shadow: 0 4px 16px 0 var(--shadow-color);
}

.search-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  flex: 1;
}

.filter-options {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--border-color);
}

.data-card {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 var(--shadow-color);
  transition: box-shadow 0.3s;
}

.dish-title {
  font-weight: 500;
  margin-bottom: 5px;
}

.dish-category {
  font-size: 0.85rem;
  color: var(--text-color-light);
}

.dish-cover {
  border-radius: 4px;
  box-shadow: 0 2px 5px var(--shadow-color);
  transition: transform 0.3s;
}

.dish-cover:hover {
  transform: scale(1.03);
}

.empty-state {
  padding: 2rem 0;
  text-align: center;
}

.pagination-container {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.preview-info h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--heading-color);
}

.preview-meta {
  margin-bottom: 1.5rem;
}

.preview-image {
  margin: 1.5rem 0;
  text-align: center;
}

.preview-cover {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.preview-content {
  padding: 1rem;
  background-color: var(--background-soft);
  border-radius: 8px;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .search-container {
    flex-wrap: wrap;
  }

  .search-input {
    width: 100%;
  }

  .action-buttons {
    justify-content: center;
  }

  .pagination-container {
    justify-content: center;
  }
}
</style>
