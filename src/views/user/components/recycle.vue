<script setup>
import { addUserAPI } from '@/api/user'

// 定义props接收父组件传递的数据
const props = defineProps([
  'recycleList',
  'isShow',
  'tableLabel',
  'indexMethod',
  'getUserData',
])

// 定义emit用于向父组件传递事件
const emit = defineEmits(['update-recycle-list', 'update:isShow'])

// 关闭回收站窗口
const handleClose = () => {
  emit('update:isShow', false)
}

// 从回收站中永久删除用户数据
const handleDelUser = (val) => {
  try {
    ElMessageBox.confirm(
      `确定要永久删除用户 '${val.name}' 这一条数据吗？`,
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      },
    ).then(() => {
      // 从回收站中删除用户数据
      const index = props.recycleList.userList.indexOf(val)
      if (index !== -1) {
        // 通知父组件更新数据列表
        emit('update-recycle-list', index)
        ElMessage.success(`用户 '${val.name}' 数据已永久删除`)
      } else {
        ElMessage.error(`用户 '${val.name}' 不存在`)
      }
    })
  } catch (error) {
    ElMessage.error(error.message || '删除用户失败，请重试')
  }
}

// 从回收站中恢复用户数据
const handleRecover = async (val) => {
  try {
    ElMessageBox.confirm(`确定要恢复用户 '${val.name}' 吗？`, 'Warning', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 执行恢复操作(添加用户)
      await addUserAPI(val)

      // 从回收站中删除用户数据
      const index = props.recycleList.userList.indexOf(val)
      if (index !== -1) {
        // 通知父组件更新数据列表
        emit('update-recycle-list', index)
        ElMessage.success(`用户 '${val.name}' 数据已恢复`)
        try {
          // 调用父组件的方法更新数据列表
          await props.getUserData()
        } catch (error) {
          ElMessage.error(error.message || '更新数据列表失败，请重试')
        }
      } else {
        ElMessage.error(`用户 '${val.name}' 不存在`)
      }
    })
  } catch (error) {
    ElMessage.error(error.message || '恢复用户失败，请重试')
  }
}

// 一键清空回收站数据
const handleClearRecycle = () => {
  try {
    ElMessageBox.confirm('确定要清空回收站中的所有数据吗？', 'Warning', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }).then(() => {
      // 通知父组件清空回收站数据
      emit('update-recycle-list', -1)
      // 显示成功消息
      ElMessage.success('回收站数据已清空')

      // 关闭回收站窗口
      handleClose()
    })
  } catch (error) {
    ElMessage.error(error.message || '清空回收站失败，请重试')
  }
}
</script>

<template>
  <el-dialog
    :model-value="props.recycleList.isShow"
    title="回收站数据列表"
    @close="handleClose"
  >
    <el-button
      type="danger"
      @click="handleClearRecycle"
      :disabled="props.recycleList.userList.length === 0"
    >
      一键清空
    </el-button>
    <el-table
      :data="props.recycleList.userList"
      style="width: 100%"
      height="500px"
    >
      <el-table-column
        align="center"
        fixed="left"
        type="index"
        :index="indexMethod"
        label="序号"
        :width="65"
      />
      <el-table-column
        v-for="item in props.tableLabel"
        align="center"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? 125 : 65"
      />
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <!-- 恢复用户数据按钮 -->
          <el-button
            type="primary"
            size="small"
            @click="handleRecover(scope.row)"
          >
            恢复
          </el-button>
          <!-- 永久删除用户数据按钮 -->
          <el-button
            type="danger"
            size="small"
            @click="handleDelUser(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
