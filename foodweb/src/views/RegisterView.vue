<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import userService from '@/services/userService'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

// 表单引用
const registerFormRef = ref<FormInstance>()

// 表单数据
const registerForm = reactive({
  user: {
    username: '',
    passwordHash: '',
    confirmPassword: '',
    email: '',
    phone: '',
  },
  verificationCode: '',
})

// 验证规则
const registerRules = reactive<FormRules>({
  'user.username': [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' },
  ],
  'user.passwordHash': [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' },
  ],
  'user.confirmPassword': [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.user.passwordHash) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  'user.email': [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

// 状态
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
const timer = ref<number | null>(null)

// 发送验证码
const sendVerificationCode = async () => {
  if (countdown.value > 0) return
  if (!registerForm.user.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }

  sendingCode.value = true
  countdown.value = 60

  try {
    await userService.sendVerificationCode(registerForm.user.email)
    ElMessage.success('验证码已发送至邮箱，请注意查收')

    timer.value = window.setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer.value!)
        timer.value = null
      }
    }, 1000)
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message || '发送验证码失败')
    } else {
      ElMessage.error('发送验证码失败')
    }
  } finally {
    sendingCode.value = false
  }
}

// 处理注册
const handleRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 确保密码是字符串类型
        if (typeof registerForm.user.passwordHash === 'number') {
          registerForm.user.passwordHash = String(registerForm.user.passwordHash)
        }

        // 使用正确的嵌套格式
        const registerData = {
          user: {
            username: registerForm.user.username,
            passwordHash: registerForm.user.passwordHash,
            email: registerForm.user.email,
            phone: registerForm.user.phone || '',
          },
          verificationCode: registerForm.verificationCode,
        }

        await userService.register(registerData)
        ElMessage.success('注册成功，请登录')
        router.push('/login')
      } catch (error) {
        if (error instanceof Error) {
          ElMessage.error(error.message || '注册失败')
        } else {
          ElMessage.error('注册失败')
        }
      } finally {
        loading.value = false
      }
    }
  })
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
})
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="title">
        <h2>用户注册</h2>
      </div>
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerFormRef"
        class="register-form"
        label-width="80px"
        status-icon
      >
        <el-form-item label="用户名" prop="user.username">
          <el-input v-model="registerForm.user.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user.passwordHash">
          <el-input
            v-model="registerForm.user.passwordHash"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="user.confirmPassword">
          <el-input
            v-model="registerForm.user.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="user.email">
          <el-input
            v-model="registerForm.user.email"
            placeholder="请输入邮箱"
            type="email"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="user.phone">
          <el-input v-model="registerForm.user.phone" placeholder="选填"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verificationCode">
          <div class="code-input">
            <el-input v-model="registerForm.verificationCode" placeholder="请输入验证码"></el-input>
            <el-button
              type="primary"
              :disabled="sendingCode || countdown > 0"
              @click="sendVerificationCode"
            >
              {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister(registerFormRef)" :loading="loading">
            注册
          </el-button>
          <el-button @click="router.push('/login')">已有账号？去登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem 0;
}

.register-card {
  width: 100%;
  max-width: 500px;
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow-color);
  padding: 2rem;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
}

.title h2 {
  color: var(--heading-color);
  font-size: 1.8rem;
  position: relative;
  display: inline-block;
}

.title h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
}

.register-form {
  margin-top: 1rem;
}

.code-input {
  display: flex;
  gap: 10px;
}

.code-input .el-input {
  flex: 1;
}

@media screen and (max-width: 576px) {
  .register-card {
    padding: 1.5rem;
    margin: 0 1rem;
  }

  .code-input {
    flex-direction: column;
  }
}
</style>
