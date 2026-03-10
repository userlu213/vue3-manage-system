<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { getUserAPI, delUserAPI, addUserAPI } from '../api/user'
import { debounce } from '@/utils/debounce'
import Recycle from './user/components/recycle.vue'
import userInfo from './user/components/userInfo.vue'

// 表单标题数据
const tableLabel = reactive([
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'age',
    label: '年龄',
  },
  {
    prop: 'sexLabel',
    label: '性别',
  },
  {
    prop: 'birth',
    label: '出生日期',
    width: 200,
  },
  {
    prop: 'addr',
    label: '地址',
    width: 400,
  },
])
// 用户列表数据
const userList = ref([])

// 获取用户列表数据
const getUserData = async () => {
  try {
    const res = await getUserAPI(config)
    userList.value = res.list.map((item) => ({
      // 处理用户性别
      sexLabel: item.sex === 1 ? '男' : '女',
      ...item,
    }))
    config.total = res.count
    if (userList.value.length === 0) {
      ElMessage({ message: '暂无用户数据', type: 'info' })
    }
  } catch (error) {
    ElMessage.error(error.message || '获取用户列表失败，请重试')
  }
}

// 搜索框数据
const formInline = reactive({
  keyWords: '',
})
// 搜索框及分页相关数据
const config = reactive({
  name: '',
  total: 0,
  page: 1,
})

// 搜索框查询处理函数
const handleSearch = debounce(() => {
  try {
    config.name = formInline.keyWords
    config.page = 1
    getUserData()
  } catch (error) {
    ElMessage.error(error.message || '搜索用户列表失败，请重试')
  }
}, 300)

// 监听搜索框变化
watch(
  () => formInline.keyWords,
  debounce((newObj) => {
    try {
      config.name = formInline.keyWords
      getUserData()
    } catch (error) {
      ElMessage.error(error.message || '搜索用户列表失败，请重试')
    }
  }, 300),
)

// 分页相关
const pageChange = (page) => {
  try {
    config.page = page
    getUserData()
  } catch (error) {
    ElMessage.error(error.message || '分页获取用户列表失败，请重试')
  }
}

// 存储删除用户相关状态
const deleteState = reactive({
  deletedUser: null, // 被删除的用户
  originalList: [], // 删除前的用户列表
  timer: null, // 撤销计时器
  timeout: 3000, // 撤销时间限制（3秒）
  manualClose: true, // 是否禁用撤销删除操作标志
})

// 回收站相关数据
const recycleList = reactive({
  user: null, // 当前选中的用户
  userList: [], // 回收站用户列表
  isShow: false, // 是否显示回收站页面
})

// 删除用户
const delUser = async (val, type) => {
  try {
    // type不传默认为false 执行批量删除操作
    if (type) {
      // 执行删除操作
      await delUserAPI({ id: val.id })

      // 超时后重置删除状态
      cleanupDeleteState()
      // 将批量删除的用户信息添加进回收站
      recycleList.userList.push(val)
      // 并将recycleList.userList存储到本地
      localStorage.setItem('recycleList', JSON.stringify(recycleList.userList))

      // 删除成功后，重置到第一页并获取数据
      config.page = 1
      getUserData()
    } else {
      ElMessageBox.confirm(`确定要删除用户 '${val.name}' 吗？`, 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // 保存删除前的状态
        deleteState.deletedUser = { ...val }
        deleteState.originalList = [...userList.value]

        // 存储删除前的用户数据 可用于回收站操作
        recycleList.user = deleteState.deletedUser

        // 执行删除操作
        await delUserAPI({ id: val.id })

        // 显示可撤销的提示消息
        ElMessage({
          message: `用户 '${val.name}' 已被删除, ${deleteState.timeout / 1000} 秒内点击撤销按钮进行回退`,
          type: 'success',
          duration: deleteState.timeout,
        })

        // 开启撤销删除按钮
        deleteState.manualClose = false

        // 设置撤销计时器
        deleteState.timer = setTimeout(() => {
          // 超时后重置删除状态
          cleanupDeleteState()
          // 将删除的用户信息添加进回收站
          recycleList.userList.push(recycleList.user)
          // 并将recycleList.userList存储到本地
          localStorage.setItem(
            'recycleList',
            JSON.stringify(recycleList.userList),
          )
        }, deleteState.timeout)

        // 删除成功后，重置到第一页并获取数据
        config.page = 1
        getUserData()
      })
    }
  } catch (error) {
    ElMessage.error(error.message || '删除用户失败，请重试')
  }
}

// 撤销删除操作
const undoDelete = async () => {
  if (!deleteState.deletedUser) {
    ElMessage.warning('撤销操作超时')
    return
  }

  try {
    // 清除撤销计时器
    if (deleteState.timer) {
      clearTimeout(deleteState.timer)
      deleteState.timer = null
    }

    // 恢复用户数据
    await addUserAPI(deleteState.deletedUser)

    ElMessage.success(`已撤销对用户 '${deleteState.deletedUser.name}' 的删除 `)

    // 重置删除状态
    cleanupDeleteState()
    // 清空存储删除前的用户数据 不添加进回收站
    recycleList.user = null
    recycleList.isAdd = false

    // 刷新数据
    getUserData()
  } catch (error) {
    ElMessage.error(error.message || '撤销删除失败，请重试')
  }
}

// 重置删除状态方法
const cleanupDeleteState = () => {
  deleteState.deletedUser = null
  deleteState.originalList = []
  deleteState.manualClose = true
}

// 控制新增用户弹窗显示/隐藏
const dialogVisible = ref(false)
// 控制弹框标题名称
const action = ref('add')
// 用户表单信息
const formUser = reactive({})

// 打开新增用户对话框弹窗
const handleAdd = () => {
  action.value = 'add'
  dialogVisible.value = true
}

// 编辑用户信息功能
const handleEdit = (val) => {
  action.value = 'edit'
  dialogVisible.value = true
  // 解决DOM渲染问题
  nextTick(() => {
    Object.assign(formUser, { ...val })
  })
}

// 表格序号
const indexMethod = (index) => {
  return (config.page - 1) * 10 + index + 1
}

// 批量操作相关数据
const batchOperation = reactive({
  selectedUsers: [], // 选中的用户
  isShow: false, // 是否展示复选框按钮及全选框
})

// 批量操作用户数据
const showBatchOperation = (val) => {
  try {
    ElMessageBox.confirm(
      `确定要批量删除选中的这 ${val.length} 条数据吗？`,
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      },
    ).then(() => {
      // 执行删除操作
      val.forEach((item) => {
        delUser(item, true)
      })
      // 清空选中的用户
      batchOperation.selectedUsers = []
      // 退出批量操作模式
      batchOperation.isShow = false

      ElMessage.success(`已成功删除 ${val.length} 条数据`)
    })
  } catch (error) {
    ElMessage.error(error.message || '批量操作失败，请重试')
  }
}

// 取消批量操作
const handleCancelBatch = () => {
  // 隐藏复选框按钮及全选框
  batchOperation.isShow = false
  // 清空选中的用户
  batchOperation.selectedUsers = []
}

// 父组件响应子组件回收站删除操作（更新recycleList数据）
const handleUpdateRecycleList = (index) => {
  if (index > -1) {
    recycleList.userList.splice(index, 1)
    // 通知localStorage更新数据
    localStorage.setItem('recycleList', JSON.stringify(recycleList.userList))
  } else {
    // index为0时 清空回收站数据
    recycleList.userList = []
    // 通知localStorage更新数据
    localStorage.setItem('recycleList', JSON.stringify(recycleList.userList))
  }
}

onMounted(() => {
  getUserData()
  // 从本地存储（模拟从服务器）获取回收站数据
  recycleList.userList = JSON.parse(localStorage.getItem('recycleList')) || []
})
</script>

<template>
  <!-- 头部 -->
  <div class="user-header">
    <div class="left">
      <!-- 新增用户按钮 -->
      <el-button
        v-show="!batchOperation.isShow"
        type="primary"
        @click="handleAdd"
        class="addBtn"
      >
        新增
      </el-button>
      <!-- 批量操作按钮 -->
      <el-button
        v-show="!batchOperation.isShow"
        type="danger"
        @click="batchOperation.isShow = true"
      >
        批量操作
      </el-button>
      <!-- 回收站 -->
      <el-badge
        v-show="!batchOperation.isShow"
        :value="recycleList.userList.length"
      >
        <el-button
          type="info"
          @click="recycleList.isShow = true"
          class="handleRecycle"
        >
          回收站
        </el-button>
      </el-badge>
      <!-- 批量操作——删除/取消选中用户按钮 -->
      <span v-show="batchOperation.isShow">
        <el-button
          type="danger"
          @click="showBatchOperation(batchOperation.selectedUsers)"
          :disabled="batchOperation.selectedUsers.length === 0"
        >
          删除选中用户({{ batchOperation.selectedUsers.length }})
        </el-button>
        <el-button @click="handleCancelBatch">取消</el-button>
      </span>
    </div>
    <div class="right">
      <!-- 撤销删除按钮 -->
      <el-button
        v-show="!batchOperation.isShow"
        type="warning"
        @click="undoDelete"
        class="undoDelBtn"
        :disabled="deleteState.manualClose"
      >
        撤销删除
      </el-button>
      <!-- 搜索框 -->
      <el-form :inline="true" :model="formInline" class="search-form">
        <el-form-item>
          <el-input
            placeholder="请输入要搜索的用户名"
            v-model="formInline.keyWords"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <!-- 中部——用户列表 -->
  <div class="table">
    <el-table :data="userList" style="width: 100%">
      <!-- 复选框列 -->
      <el-table-column
        v-if="batchOperation.isShow"
        align="center"
        fixed="left"
        width="55"
      >
        <template #default="scope">
          <el-checkbox-group v-model="batchOperation.selectedUsers">
            <el-checkbox :value="scope.row" />
          </el-checkbox-group>
        </template>
      </el-table-column>
      <!-- 序号 -->
      <el-table-column
        align="center"
        type="index"
        :index="indexMethod"
        label="序号"
        :width="80"
      />
      <!-- 用户信息列-->
      <el-table-column
        v-for="item in tableLabel"
        align="center"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : 125"
      />
      <!-- 操作列 -->
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <span v-show="!batchOperation.isShow">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="delUser(scope.row)"
              :disabled="!deleteState.manualClose"
            >
              删除
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页器 -->
  <el-pagination
    class="pager"
    background
    layout="prev, pager, next,slot"
    :total="config.total"
    @current-change="pageChange"
  >
    <template #default>
      <span>共 {{ config.total }} 条数据</span>
    </template>
  </el-pagination>
  <!-- 新增/编辑用户弹框 -->
  <userInfo
    v-model:dialogVisible="dialogVisible"
    :formUser="formUser"
    :action="action"
    :getUserData="getUserData"
  />
  <!-- 回收站组件 -->
  <!-- 使用v-model 语法糖 简化 props + emits 的写法 -->
  <recycle
    :recycleList="recycleList"
    v-model:isShow="recycleList.isShow"
    :indexMethod="indexMethod"
    :tableLabel="tableLabel"
    :getUserData="getUserData"
    @update-recycle-list="handleUpdateRecycleList"
  />
</template>

<style lang="less" scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  .el-form-item {
    margin-right: 10px;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    .undoDelBtn {
      margin-right: 10px;
    }
  }
  .handleRecycle {
    margin-left: 10px;
  }
}
.table {
  height: 480px;
  .el-table {
    width: 100%;
    height: 480px;
  }
}
.pager {
  margin-top: 5px;
  justify-content: flex-end;
  right: 10px;
}
</style>
