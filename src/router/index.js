// 路由配置
import { createRouter, createWebHistory } from 'vue-router'
import { useAllDataStore } from '@/stores'

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/Main.vue'),
    redirect: '/home',
    children: [],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  // 设置路由模式
  history: createWebHistory(),
  routes,
})

// 路由白名单 - 不需要登录验证的页面
const whiteList = ['/login', '/404']

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取store和token
  const store = useAllDataStore()
  const token = store.state.token || localStorage.getItem('token')
  // 设置页面标题
  document.title = to.meta.title || '通用后台管理系统'

  // 白名单直接放行
  if (whiteList.includes(to.path)) {
    // 如果token存在要访问login页面时 返回首页
    if (token && to.path === '/login') {
      next('/home')
      ElMessage.info('您已登录，无需重复登录')
      return
    }
    next()
    return
  }

  // 无token重定向登录
  if (!token) {
    next('/login')
    ElMessage.info('您未登录，无法访问该页面')
    return
  }

  // 检查路由是否存在
  if (!router.hasRoute(to.name) && to.path !== '/404') {
    next('/404')
    return
  }

  next()
})

export default router
