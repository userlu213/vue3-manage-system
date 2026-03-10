<script setup lang="ts">
import { computed } from 'vue'
import { useAllDataStore } from '../stores'
import { useRouter } from 'vue-router'
import { getImageUrl } from '@/utils/getImageUrl'

const store = useAllDataStore()

// 退出登录
const router = useRouter()
const logout = () => {
  // 调用清理路由方法
  store.clearn()
  ElMessage.success('已退出登录状态')
  setTimeout(() => {
    router.replace('/login')
  }, 100)
}
const current = computed(() => store.state.currentMenu)
</script>

<template>
  <div class="header">
    <!-- 左侧 侧边栏按钮 -->
    <div class="l-content">
      <el-button
        class="icons"
        icon="menu"
        size="small"
        @click="store.state.isCollapse = !store.state.isCollapse"
      />
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="current" :to="current.path">
          {{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 右侧 用户信息及其他操作 -->
    <div class="r-content">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img :src="getImageUrl('user')" class="user" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>首页</el-dropdown-item>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item>
              <a
                href="https://gitee.com/susuleilei/project_BMS"
                target="_blank"
              >
                项目地址
              </a>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #333;
  .l-content {
    display: flex;
    align-items: center;
    .icons {
      margin-right: 20px;
    }
  }
  .r-content {
    .user {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
:deep(.bread span) {
  color: #fff !important;
  cursor: pointer !important;
}
</style>
