import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/less/reset.less'
// 引入全部icons图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入pinia
import { createPinia } from 'pinia'
// 引入mockjs
import '@/api/mockData/mock.js'
import { useAllDataStore } from '@/stores'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// 调用addMenu函数，将路由列表添加到store中
const store = useAllDataStore()
// 刷新页面时，从localStorage中获取数据，更新state
store.addMenu(router, 'refresh')

app.use(router).mount('#app')
// 注册全部icons图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
