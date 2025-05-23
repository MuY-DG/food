<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const redirectPath = (route.query.redirect as string) || '/'

// 登录表单实例
const loginFormRef = ref<FormInstance>()
// 登录表单数据
const loginForm = reactive({
  username: '',
  passwordHash: '',
})
// 表单验证规则
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' },
  ],
  passwordHash: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度应不少于6个字符', trigger: 'blur' },
  ],
})

// 登录中状态
const loading = ref(false)

// 处理登录
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 调用store的登录方法
        const success = await userStore.login(loginForm)

        if (success) {
          // 登录成功后重定向
          router.push(redirectPath)
        }
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title">
        <h2>用户登录</h2>
      </div>
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        label-position="top"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="user"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwordHash">
          <el-input
            v-model="loginForm.passwordHash"
            type="password"
            placeholder="请输入密码"
            prefix-icon="lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin(loginFormRef)"
            :loading="loading"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
        <div class="register-link">
          还没有账号？<router-link to="/register">立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: var(--background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 10px var(--shadow-color);
  padding: 2rem;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
}

.title h2 {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin: 0;
}

.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  margin-top: 1rem;
}

.register-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 14px;
}

.register-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
}
</style>
