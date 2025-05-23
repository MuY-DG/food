<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import categoryService from '@/services/categoryService'
import type { Category } from '@/types/api'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, RefreshRight } from '@element-plus/icons-vue'

// 状态
const loading = ref(false)
const categories = ref<Category[]>([])
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const submitting = ref(false)

// 表单数据
const categoryForm = reactive({
  categoryId: 0,
  name: '',
})

// 表单验证规则
const categoryRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符之间', trigger: 'blur' },
  ],
})

// 搜索关键词
const searchKeyword = ref('')

// 表单引用
const categoryFormRef = ref<FormInstance>()

// 加载分类列表
const loadCategories = async () => {
  loading.value = true
  try {
    categories.value = await categoryService.getAllCategories()
  } catch (error) {
    console.error('获取分类列表失败', error)
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}

// 显示添加对话框
const showAddDialog = () => {
  categoryForm.categoryId = 0
  categoryForm.name = ''
  addDialogVisible.value = true
}

// 显示编辑对话框
const showEditDialog = (category: Category) => {
  categoryForm.categoryId = category.categoryId
  categoryForm.name = category.name
  editDialogVisible.value = true
}

// 处理添加分类
const handleAddCategory = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await categoryService.addCategory(categoryForm.name)
      ElMessage.success('添加成功')
      addDialogVisible.value = false
      loadCategories()
    } catch (error) {
      console.error('添加失败', error)
      ElMessage.error('添加失败')
    } finally {
      submitting.value = false
    }
  })
}

// 处理编辑分类
const handleEditCategory = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await categoryService.updateCategory(categoryForm.categoryId, categoryForm.name)
      ElMessage.success('更新成功')
      editDialogVisible.value = false
      loadCategories()
    } catch (error) {
      console.error('更新失败', error)
      ElMessage.error('更新失败')
    } finally {
      submitting.value = false
    }
  })
}

// 处理删除分类
const handleDeleteCategory = (categoryId: number) => {
  ElMessageBox.confirm('确认删除该分类？删除后可能影响已关联的菜品', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await categoryService.deleteCategory(categoryId)
        ElMessage.success('删除成功')
        loadCategories()
      } catch (error) {
        console.error('删除失败', error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

// 格式化日期
const formatDate = (timestamp: number) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// 过滤分类列表
const filteredCategories = computed(() => {
  if (!searchKeyword.value) return categories.value

  return categories.value.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      cat.categoryId.toString().includes(searchKeyword.value),
  )
})

// 搜索
const handleSearch = () => {
  // 直接通过计算属性过滤
}

// 重置搜索
const handleReset = () => {
  searchKeyword.value = ''
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div class="category-manage">
    <div class="page-header">
      <div class="header-info">
        <h2>分类管理</h2>
        <p class="description">管理系统中的菜品分类，添加、编辑或删除分类。</p>
      </div>
      <el-button type="primary" @click="showAddDialog" :icon="Plus">添加分类</el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索分类名称或ID"
          clearable
          @keyup.enter="handleSearch"
          :prefix-icon="Search"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
        <el-button :icon="RefreshRight" @click="handleReset" circle></el-button>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card v-loading="loading" class="data-card">
      <el-table
        :data="filteredCategories"
        style="width: 100%"
        border
        stripe
        :empty-text="loading ? '加载中...' : '暂无分类数据'"
      >
        <el-table-column label="ID" prop="categoryId" width="100" />
        <el-table-column label="分类名称" prop="name" min-width="200">
          <template #default="{ row }">
            <div class="category-name">{{ row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              :icon="Edit"
              circle
              @click="showEditDialog(row)"
              title="编辑"
            />
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              circle
              @click="handleDeleteCategory(row.categoryId)"
              title="删除"
            />
          </template>
        </el-table-column>
      </el-table>

      <div v-if="filteredCategories.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无分类数据" />
      </div>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加分类"
      width="500px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleAddCategory(categoryFormRef)"
            :loading="submitting"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑分类"
      width="500px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="分类ID">
          <el-input v-model="categoryForm.categoryId" disabled />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleEditCategory(categoryFormRef)"
            :loading="submitting"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.category-manage {
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

.search-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-container .el-input {
  flex: 1;
}

.data-card {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 var(--shadow-color);
  transition: box-shadow 0.3s;
}

.data-card:hover,
.search-card:hover {
  box-shadow: 0 4px 16px 0 var(--shadow-color);
}

.category-name {
  font-weight: 500;
  color: var(--text-color);
}

.empty-state {
  padding: 2rem 0;
  text-align: center;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .search-container {
    flex-direction: column;
  }
}
</style>
