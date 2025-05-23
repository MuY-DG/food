<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import userService from '@/services/userService'
import type { User, PageResponse } from '@/types/api'

// 状态
const loading = ref(false)
const users = ref<User[]>([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 搜索参数
const searchParams = reactive({
  username: '',
  email: '',
  role: '',
})

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    const response = await userService.getAllUsers(currentPage.value - 1, pageSize.value)
    users.value = response.content
    total.value = response.totalElements
  } catch (error) {
    console.error('获取用户列表失败', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索用户
const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

// 重置搜索
const handleReset = () => {
  searchParams.username = ''
  searchParams.email = ''
  searchParams.role = ''
  currentPage.value = 1
  loadUsers()
}

// 页码改变
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadUsers()
}

// 每页条数改变
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadUsers()
}

// 查看详情
const showUserDetail = (user: User) => {
  ElMessageBox.alert(
    `
    <div class="user-detail">
      <div class="detail-item"><b>用户ID:</b> ${user.userId}</div>
      <div class="detail-item"><b>用户名:</b> ${user.username}</div>
      <div class="detail-item"><b>邮箱:</b> ${user.email}</div>
      <div class="detail-item"><b>电话:</b> ${user.phone || '未设置'}</div>
      <div class="detail-item"><b>角色:</b> ${formatRole(user.role)}</div>
      <div class="detail-item"><b>注册时间:</b> ${formatDate(user.createdAt)}</div>
      <div class="detail-item"><b>更新时间:</b> ${formatDate(user.updatedAt)}</div>
    </div>
  `,
    '用户详情',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭',
      callback: () => {},
    },
  )
}

// 格式化日期
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 获取用户角色标签类型
const getRoleTagType = (role: string) => {
  return role === 'ADMIN' ? 'danger' : 'info'
}

// 格式化用户角色显示
const formatRole = (role: string) => {
  const roleMap: Record<string, string> = {
    ADMIN: '管理员',
    USER: '普通用户',
  }
  return roleMap[role] || role
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="user-manage">
    <!-- 页面标题和描述 -->
    <div class="page-header">
      <div class="header-info">
        <h2>用户管理</h2>
        <p class="description">管理和监控系统用户，查看用户详细信息。</p>
      </div>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchParams" class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchParams.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="searchParams.email"
            placeholder="请输入邮箱"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchParams.role" placeholder="全部角色" clearable>
            <el-option label="管理员" value="ADMIN" />
            <el-option label="普通用户" value="USER" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="'Search'">搜索</el-button>
          <el-button @click="handleReset" :icon="'Refresh'">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card v-loading="loading" class="data-card">
      <el-table :data="users" style="width: 100%" border stripe row-key="userId">
        <el-table-column label="ID" prop="userId" width="80" />
        <el-table-column label="用户名" prop="username" min-width="120">
          <template #default="{ row }">
            <el-button type="primary" text @click="showUserDetail(row)">
              {{ row.username }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" min-width="180" />
        <el-table-column label="电话" min-width="120">
          <template #default="{ row }">
            <span :class="{ 'text-muted': !row.phone }">{{ row.phone || '未设置' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)" effect="dark">
              {{ formatRole(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" min-width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="160">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="showUserDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="users.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无用户数据" />
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
  </div>
</template>

<style scoped>
.user-manage {
  margin-bottom: 2rem;
}

.page-header {
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

.search-card:hover {
  box-shadow: 0 4px 16px 0 var(--shadow-color);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.data-card {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 var(--shadow-color);
  transition: box-shadow 0.3s;
}

.data-card:hover {
  box-shadow: 0 4px 16px 0 var(--shadow-color);
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

.text-muted {
  color: var(--text-color-light);
  font-style: italic;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }

  .search-form .el-form-item {
    margin-right: 0;
    width: 100%;
  }

  .el-pagination {
    justify-content: center;
  }
}

:deep(.user-detail) {
  text-align: left;
  padding: 10px;
}

:deep(.detail-item) {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--border-color);
}

:deep(.detail-item:last-child) {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
</style>
