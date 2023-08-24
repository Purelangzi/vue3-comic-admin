<template>
  <div class="login">
    <el-row :gutter="20">
      <el-col :span="8" :xs="6" :sm="12"></el-col>
      <el-col :span="16" :xs="18" :sm="12">
        <el-form
          :model="form"
          ref="ruleFormRef"
          :rules="rules"
          class="login-form"
        >
          <h1 class="welcome">欢迎{{ isLogin ? '登录' : '注册' }}</h1>
          <el-form-item prop="username" v-if="!isLogin">
            <el-input
              prefix-icon="User"
              v-model.trim="form.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="account">
            <el-input
              prefix-icon="User"
              autofocus
              v-model.trim="form.account"
              autocomplete="on"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="Lock"
              v-model.trim="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn"
              :loading="loading"
              type="primary"
              @click="submitForm(ruleFormRef)"
            >
              {{ isLogin ? '登录' : '注册' }}
            </el-button>
          </el-form-item>
          <div class="register" @click="goBack">
            {{ isLogin ? '注册账号' : '返回登录' }}
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ElNotification, FormInstance, FormRules } from 'element-plus'
import { useUserInfoStore } from '@/store/modules/user'
import { useTimePeriod } from '@/hooks/useDate'
const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const route = useRoute()
const form = reactive({
  account: '',
  password: '',
  username: '',
})
const redirect = ref('')
const loading = ref(false)
const isLogin = ref(true)
const useUserStore = useUserInfoStore()
const { timePeriod } = useTimePeriod()
const rules = reactive<FormRules>({
  account: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 3, max: 11, message: '长度  3 到 11', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 3, max: 15, message: '长度  3 到 15', trigger: 'blur' },
  ],
  username: [{ required: true, trigger: 'blur', message: '昵称不能为空' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true

      try {
        const message = await useUserStore[
          isLogin.value ? 'userLogin' : 'userRegister'
        ](form)

        // router.push('/')
        // 方法一：解决切换登录账号重定向到没权限的页面404，仍保留重定向之前页面的功能
        // 刚注册的账号服务器返回默认无权限为空，所以得加?
        const flag = useUserStore.serverRoutes?.some((el) => {
          if (el.children && el.children.length) {
            return el.children.some((item) => item.path === redirect.value)
          } else {
            return el.path == redirect.value
          }
        })
        if (flag) {
          router.push({
            path: isLogin.value ? redirect.value || '/' : '/login',
          })
        } else {
          router.push({ path: isLogin.value ? '/' : '/login' })
        }

        // 方法二：全部重定向到首页
        // router.push({ path: isLogin?'/':'/login'})

        reset()
        if (isLogin.value) {
          ElNotification.success({
            title: `Hi,${timePeriod.value}好`,
            message,
          })
        }
      } catch (error) {
        ElNotification.error((error as Error).message)
      } finally {
        loading.value = false
      }
    } else {
      ElNotification.error('输入规则不对')
    }
  })
}

const goBack = () => {
  isLogin.value = !isLogin.value
  reset()
}
const reset = () => {
  ruleFormRef.value?.resetFields()
  ruleFormRef.value?.clearValidate()
}
watch(
  () => route.path,
  () => {
    redirect.value = route.query?.redirect as string
  },
  {
    immediate: true,
  },
)
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100vh;
  background-color: #2d3a4b;

  .welcome {
    margin-bottom: 40px;
    font-size: 20px;
    color: #fff;
  }

  .login-form {
    position: relative;
    top: 30vh;
    width: 50%;
    padding: 40px 20px;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;

    .login-btn {
      width: 100%;
    }
  }

  .register {
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
