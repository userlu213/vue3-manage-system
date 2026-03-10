import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

function initState() {
  return {
    // 左侧菜单栏是否折叠
    isCollapse: false,
    tags: [
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'home',
      },
    ],
    currentMenu: null,
    menuList: [],
    token: '',
    // 路由列表
    routerList: [],
  }
}
export const useAllDataStore = defineStore('allData', () => {
  const state = ref(initState())

  // 监听state变化，将变化后的数据存储到localStorage中
  watch(
    state,
    (newObj) => {
      // token为空时，不执行后续操作
      if (!newObj.token) return
      // 登录成功后，将state中的数据存储到localStorage中
      localStorage.setItem('store', JSON.stringify(newObj))
    },
    { deep: true },
  )

  // tag标签的展示
  function selectMenu(val) {
    if (val.name === 'home') {
      state.value.currentMenu = null
    } else {
      // 点击非首页菜单时，将当前菜单赋值给currentMenu
      state.value.currentMenu = val
      // 当前页面不是首页的情况
      // 判断val是否在tags中，不在则推入数组
      let index = state.value.tags.findIndex((item) => item.name === val.name)
      index === -1 ? state.value.tags.push(val) : ''
    }
  }

  // tag标签的关闭
  function updateTags(tag) {
    let index = state.value.tags.findIndex((item) => item.name === tag.name)
    state.value.tags.splice(index, 1)
  }

  // 更新菜单列表
  function updateMenuList(menuList) {
    state.value.menuList = menuList
  }

  // 处理菜单路由 实现权限控制
  function addMenu(router, type) {
    // 刷新页面时，从localStorage中获取数据，更新state
    if (type === 'refresh') {
      // 如果localStorage中存在数据，将其更新到state中
      if (JSON.parse(localStorage.getItem('store'))) {
        state.value = JSON.parse(localStorage.getItem('store'))
        // 刷新页面时，将路由列表清空 避免路由重复
        state.value.routerList = []
      } else {
        return
      }
    }
    const menu = state.value.menuList
    /**
     * 使用Vite的import.meta.glob方法批量导入../views/目录下所有.vue文件
     * 返回一个对象，键 是文件路径，值 是动态导入函数
     * 可以实现按需加载，提高应用性能
     *  */
    const module = import.meta.glob('../views/**/*.vue')
    // routeArr用于存储处理后的路由配置
    const routeArr = []

    // 遍历菜单列表，处理子路由
    menu.forEach((item) => {
      if (item.children) {
        item.children.forEach((val) => {
          let url = `../views/${val.url}.vue`
          if (module[url]) {
            // 处理动态导入的组件  路由就知道要渲染哪个组件
            val.component = module[url]
            // 我们只需要为item.children中的菜单添加路由，所以我们把它解构出来
            routeArr.push(...item.children)
          }
        })
      } else {
        let url = `../views/${item.url}.vue`
        item.component = module[url]
        routeArr.push(item)
      }
    })
    // 清空之前的路由配置 避免路由累积
    state.value.routerList = []
    let routers = router.getRoutes()
    // 遍历已有的路由，删除非main和login的路由
    routers.forEach((item) => {
      if (
        item.name === 'main' ||
        item.name === 'login' ||
        item.name === '404'
      ) {
        // 保留main login 404路由 不删除
        return
      } else {
        if (router.hasRoute(item.name)) router.removeRoute(item.name)
      }
    })
    // 遍历处理后的路由数组，添加到路由实例中
    routeArr.forEach((item) => {
      const routeInfo = router.addRoute('main', item)
      state.value.routerList.push(routeInfo)
    })
  }

  // 清空路由列表 并重置state为初始状态
  function clearn() {
    // 清空路由列表
    state.value.routerList.forEach((item) => {
      // 调用路由实例的removeRoute方法删除路由
      if (item) item()
    })

    // 重置state为初始状态
    state.value = initState()
    localStorage.removeItem('store')

    // 清空路由列表
    state.value.routerList = []
  }

  return { state, selectMenu, updateTags, updateMenuList, addMenu, clearn }
})
