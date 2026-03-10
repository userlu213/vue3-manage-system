<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getMenu } from '@/api/permission'
import { useAllDataStore } from '../stores'

const router = useRouter()
const store = useAllDataStore()
// 登录表单实例对象
const formRef = ref(null)
// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  agree: false,
})
// 表单校验规则
const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 4, max: 10, message: '账号长度应为4-10个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '密码长度应为6-12个字符', trigger: 'blur' },
  ],
})

// 阻止空格键输入
const preventSpace = (event) => {
  if (event.key === ' ' || event.keyCode === 32) {
    event.preventDefault()
  }
}

// 登录操作
const handleLogin = () => {
  try {
    formRef.value.validate(async (valid) => {
      if (valid) {
        // 表单验证通过，执行登录逻辑
        // 这里已经在request.js中配置了函数，请求不成功不会走这里，会直接被拦截处理
        const res = await getMenu(loginForm)
        // 登录成功后，将菜单列表及token更新到全局状态管理中
        store.updateMenuList(res.menuList)
        store.state.token = res.token
        ElMessage.success('登录成功')
        // 处理菜单路由
        store.addMenu(router)
        // 登录成功后跳转到首页
        setTimeout(() => {
          router.replace('/')
        }, 600)
      } else {
        // 表单验证失败
        ElMessage.error('账号或密码错误')
        return false
      }
    })
  } catch (error) {
    ElMessage.error(error.message || '登录失败，请重试')
  }
}
</script>

<template>
  <div class="login-container">
    <div class="logo">
      <div class="icon"></div>
      <p>欢迎登录通用后台管理系统</p>
    </div>
    <div class="form">
      <h1>账号登录</h1>
      <el-card shadow="never" class="login-card">
        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入账号"
              prefix-icon="User"
              clearable
              @keydown="preventSpace"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              show-password
              placeholder="请输入密码"
              prefix-icon="Lock"
              clearable
              @keydown="preventSpace"
            />
          </el-form-item>
          <el-form-item class="agreement-item">
            <el-checkbox v-model="loginForm.agree">
              我已阅读并同意<span class="agreement-link">用户平台使用协议</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-button"
              type="primary"
              :disabled="!loginForm.agree"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;

  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../assets/images/login_back.png) no-repeat
      center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 100px;

    .icon {
      background: url(../assets/images/logo.png) no-repeat center / contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }

    p {
      color: #fff;
      font-size: 24px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
      font-weight: 500;
      letter-spacing: 1px;
    }
  }

  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 60px;
    max-width: 500px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;

    .login-card {
      border: none;
      box-shadow: none;
      padding: 0;
    }

    h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 30px;
      color: #303133;
      padding-bottom: 15px;
    }

    .login-form {
      .el-form-item {
        margin-bottom: 24px;
      }

      .el-form-item {
        margin-bottom: 24px;

        :deep(.el-form-item__error) {
          font-size: 12px;
          color: #f56c6c;
          padding-top: 5px;
          line-height: 1.4;
        }

        &.is-error {
          .el-input {
            :deep(.el-input__wrapper) {
              border-color: #f56c6c;
              box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
            }
          }
        }
      }

      .el-input {
        width: 100%;
        height: 48px;
        margin-bottom: 5px;

        :deep(.el-input__wrapper) {
          background-color: #f8f9fc;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid #e6e8f0;
          padding: 0 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &:hover {
            border-color: #d1d5e0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          &.is-focus {
            border-color: #2752fb;
            box-shadow:
              0 0 0 3px rgba(39, 82, 251, 0.15),
              0 4px 12px rgba(0, 0, 0, 0.08);
          }
        }

        :deep(.el-input__inner) {
          height: 48px;
          line-height: 48px;
          font-size: 15px;
          color: #303133;
          background: transparent;
          border: none;
          padding: 0;
          transition: all 0.3s;

          &::placeholder {
            color: #a0a8c0;
            font-weight: 400;
          }
        }

        :deep(.el-input__prefix) {
          left: 12px;
          color: #8b92a8;
          transition: color 0.3s;
        }

        :deep(.el-input__suffix) {
          right: 12px;
          color: #8b92a8;
        }

        &:hover {
          :deep(.el-input__prefix) {
            color: #606266;
          }
        }

        &.is-focus {
          :deep(.el-input__prefix) {
            color: #2752fb;
          }
        }
      }

      .agreement-item {
        margin-bottom: 30px;

        .el-checkbox {
          color: #606266;
          font-size: 14px;
          font-weight: normal;

          :deep(.el-checkbox__label) {
            padding-left: 8px;
            line-height: 1.5;
          }
        }

        .agreement-link {
          color: #2752fb;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .login-button {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 500;
        background-color: #2752fb;
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          background-color: #1e42d8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(39, 82, 251, 0.3);
        }

        &:active {
          transform: translateY(0);
        }

        &:disabled {
          background-color: #a0cfff;
          transform: none;
          box-shadow: none;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .login-container {
    .logo {
      flex: 2;
      padding: 0 60px;
    }

    .form {
      padding: 0 40px;
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;

    .logo {
      flex: none;
      height: 40vh;
      border-top-right-radius: 0;
      border-bottom-left-radius: 30px;
      padding: 0 40px;

      p {
        font-size: 20px;
      }
    }

    .form {
      flex: 1;
      padding: 40px 30px;
      justify-content: flex-start;

      h1 {
        font-size: 24px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
