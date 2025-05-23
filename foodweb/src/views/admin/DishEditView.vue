<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import dishService from '@/services/dishService'
import categoryService from '@/services/categoryService'
import fileService from '@/services/fileService'
import { useUserStore } from '@/stores/user'
import { Plus as IconPlus, Loading as IconLoading } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Category, Dish } from '@/types/api'

// 引入依赖
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 状态
const loading = ref(false)
const submitting = ref(false)
const isEdit = computed(() => !!route.params.id)
const dishId = ref(Number(route.params.id) || 0)
const categories = ref<Category[]>([])
const uploadLoading = ref(false)

// 表单实例
const formRef = ref<FormInstance>()
// 表单数据
const formData = reactive<{
  title: string
  categoryId: number
  markdownContent: string
  coverImage: string
}>({
  title: '',
  categoryId: 0,
  markdownContent: '',
  coverImage: '',
})

// 表单验证规则
const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入菜品标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度应在2-50个字符之间', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' },
    { type: 'number', min: 1, message: '请选择分类', trigger: 'change' },
  ],
  markdownContent: [{ required: true, message: '请填写菜品内容', trigger: 'blur' }],
  coverImage: [{ required: true, message: '请上传封面图片', trigger: 'change' }],
})

// 获取所有分类
const loadCategories = async () => {
  try {
    categories.value = await categoryService.getAllCategories()
  } catch (error) {
    console.error('获取分类失败', error)
    ElMessage.error('获取分类失败')
  }
}

// 如果是编辑模式，获取菜品详情
const loadDishDetail = async () => {
  if (!isEdit.value) return

  loading.value = true
  try {
    const dish = await dishService.getDishById(dishId.value)
    formData.title = dish.title
    formData.categoryId = dish.categoryId
    formData.markdownContent = dish.markdownContent || ''
    formData.coverImage = dish.coverImage
  } catch (error) {
    console.error('获取菜品详情失败', error)
    ElMessage.error('获取菜品详情失败')
    router.push('/admin/dishes')
  } finally {
    loading.value = false
  }
}

// 上传图片逻辑
const fileInputRef = ref<HTMLInputElement | null>(null)
const handleImageClick = () => {
  // 确保fileInputRef存在后再调用click方法
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleImageUpload = async (file: File) => {
  if (!file) return

  // 验证文件类型
  const isImage = /^image\/(jpeg|png|jpg|gif)$/.test(file.type)
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return
  }

  // 验证文件大小（最大5MB）
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB')
    return
  }

  uploadLoading.value = true
  try {
    const result = await fileService.uploadFile(file)
    formData.coverImage = result.url
    ElMessage.success('上传成功')
  } catch (error) {
    console.error('上传失败', error)
    ElMessage.error('上传失败')
  } finally {
    uploadLoading.value = false
    // 清空文件输入，确保相同文件可以被再次选择
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

// 图片上传触发
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (!file.type.includes('image')) {
    ElMessage.error('请上传图片文件')
    return
  }

  await handleImageUpload(file)
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      const userId = userStore.getUserId()
      if (!userId) {
        ElMessage.error('用户信息获取失败，请重新登录')
        return
      }

      const dishData = {
        ...formData,
        userId,
      }

      if (isEdit.value) {
        // 编辑模式
        await dishService.updateDish({
          ...dishData,
          dishId: dishId.value,
        })
        ElMessage.success('菜品更新成功')
      } else {
        // 新增模式
        await dishService.addDish(dishData)
        ElMessage.success('菜品添加成功')
      }

      router.push('/admin/dishes')
    } catch (error) {
      console.error('保存失败', error)
      ElMessage.error('保存失败')
    } finally {
      submitting.value = false
    }
  })
}

// markdown编辑器的上传图片处理
const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const urls: string[] = []
  for (const file of files) {
    try {
      const result = await fileService.uploadFile(file)
      urls.push(result.url)
    } catch (error) {
      console.error('编辑器图片上传失败', error)
      ElMessage.error('编辑器图片上传失败')
    }
  }
  callback(urls)
}

// 取消操作
const handleCancel = () => {
  ElMessageBox.confirm('确认放弃当前编辑?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      router.push('/admin/dishes')
    })
    .catch(() => {})
}

// 页面初始化
onMounted(() => {
  loadCategories()
  loadDishDetail()
})
</script>

<template>
  <div class="dish-edit">
    <div class="page-header">
      <h2>{{ isEdit ? '编辑' : '添加' }}菜品</h2>
      <div class="header-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm(formRef)" :loading="submitting"
          >保存</el-button
        >
      </div>
    </div>

    <el-card class="edit-card" v-loading="loading">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        require-asterisk-position="right"
      >
        <el-row :gutter="20">
          <el-col :md="12" :sm="24">
            <el-form-item label="菜品标题" prop="title">
              <el-input v-model="formData.title" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24">
            <el-form-item label="所属分类" prop="categoryId">
              <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%">
                <el-option
                  v-for="category in categories"
                  :key="category.categoryId"
                  :label="category.name"
                  :value="category.categoryId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="封面图片" prop="coverImage">
          <div class="cover-upload">
            <div v-if="formData.coverImage" class="cover-preview">
              <img :src="formData.coverImage" alt="封面预览" />
              <div class="cover-actions">
                <el-button type="primary" size="small" @click.stop="handleImageClick">
                  更换图片
                </el-button>
              </div>
            </div>
            <div
              v-else
              class="upload-placeholder"
              @click="handleImageClick"
              :class="{ 'is-loading': uploadLoading }"
            >
              <el-icon v-if="!uploadLoading"><IconPlus /></el-icon>
              <el-icon v-else class="is-loading"><IconLoading /></el-icon>
              <span>{{ uploadLoading ? '上传中...' : '点击上传封面图片' }}</span>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleFileChange"
              />
            </div>
            <div class="upload-tip">推荐尺寸: 1200×800px，JPG/PNG格式，最大5MB</div>
          </div>
        </el-form-item>

        <el-form-item label="菜品内容" prop="markdownContent">
          <MdEditor
            v-model="formData.markdownContent"
            style="height: 500px"
            :toolbarsExclude="['github']"
            @onUploadImg="onUploadImg"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.dish-edit {
  margin-bottom: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--heading-color);
}

.edit-card {
  margin-bottom: 2rem;
}

.cover-upload {
  width: 100%;
}

.cover-preview {
  position: relative;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 12px var(--shadow-color);
}

.cover-preview img {
  width: 100%;
  display: block;
}

.cover-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px;
  display: flex;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-preview:hover .cover-actions {
  opacity: 1;
}

.upload-placeholder {
  width: 100%;
  max-width: 400px;
  height: 200px;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: var(--background-soft);
}

.upload-placeholder:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.upload-placeholder i {
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-placeholder.is-loading {
  cursor: wait;
}

.upload-tip {
  font-size: 12px;
  color: var(--text-color-light);
  margin-top: 8px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
