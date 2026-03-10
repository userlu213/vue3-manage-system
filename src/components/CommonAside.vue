<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAllDataStore } from '../stores'
import { useRoute, useRouter } from 'vue-router'

// 获取全局状态
const store = useAllDataStore()

// 侧边栏导航数据
const list = computed(() => store.state.menuList)
// 根据有无子菜单 筛选导航项
const noChildren = computed(() => list.value.filter((item) => !item.children))
const hasChildren = computed(() => list.value.filter((item) => item.children))

// 控制侧边栏是否折叠
const isCollapse = computed(() => store.state.isCollapse)
// 控制侧边栏宽度
const width = computed(() => (isCollapse.value ? '64px' : '150px'))

// 路由跳转
const router = useRouter()
const route = useRoute()
const handleMenu = (val) => {
  store.selectMenu(val)
  router.push(val.path)
}

// 设置高亮的菜单(解决首屏刷新首页菜单不高亮)
// 或者这样设置:default-active="route.path"
const activeMenu = computed(() => route.path)
</script>

<template>
  <el-aside :width="width">
    <!-- 侧边栏导航菜单 -->
    <!-- 代办——可以使用el-tree来重构 -->
    <el-menu
      background-color="#545c64"
      text-color="#fff"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activeMenu"
    >
      <h3 v-show="isCollapse">后台</h3>
      <h3 v-show="!isCollapse">后台管理系统</h3>
      <!-- 无子菜单导航项 -->
      <el-menu-item
        v-for="item in noChildren"
        :key="item.path"
        :index="item.path"
        @click="handleMenu(item)"
      >
        <component class="icon" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <!-- 有子菜单导航项 -->
      <el-sub-menu
        v-for="item in hasChildren"
        :key="item.path"
        :index="item.path"
      >
        <template #title>
          <component class="icon" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="subitem in item.children"
            :key="subitem.path"
            :index="subitem.path"
            @click="handleMenu(subitem)"
          >
            <component class="icon" :is="subitem.icon"></component>
            <span>{{ subitem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<style lang="less" scoped>
.icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  flex-shrink: 0;
}
.el-menu {
  height: 100%;
  border-right: none;
  h3 {
    color: #fff;
    text-align: center;
    line-height: 60px;
  }
}
.el-aside {
  height: 100%;
  background-color: #545c64;
}
</style>
