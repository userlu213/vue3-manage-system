<script setup>
import { ref, reactive } from 'vue'
import { addUserAPI, editUserAPI } from '@/api/user'

// 定义props接收父组件传递过来的数据
const props = defineProps([
  'dialogVisible',
  'action',
  'formUser',
  'getUserData',
])

// 定义emit触发事件
const emit = defineEmits(['update:dialogVisible'])

// 用户表单实例对象
const userForm = ref(null)
// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: '姓名未填写', trigger: 'blur' }],
  age: [
    { required: true, message: '年龄未填写', trigger: 'blur' },
    { type: 'number', message: '年龄必须是数字' },
  ],
  sex: [{ required: true, message: '性别未选择', trigger: 'change' }],
  birth: [{ required: true, message: '出生日期未填写' }],
  addr: [{ required: true, message: '地址未填写' }],
})

// 添加用户完成/点击取消 关闭表单弹框
const updateDialogVisible = () => {
  emit('update:dialogVisible', false)
  // 重置表单信息 使用可选链操作符避免空指针异常
  userForm.value?.resetFields()
}

// 提交表单信息(添加/编辑用户)
const onSubmit = () => {
  try {
    // 进行表单校验规则判断
    userForm.value.validate(async (validate) => {
      if (validate) {
        // 空数据接收接口返回结果
        let res = null
        // 判断是新增还是编辑
        if (props.action === 'add') {
          res = await addUserAPI(props.formUser)
        } else {
          res = await editUserAPI(props.formUser)
        }
        // 接口调用成功时更新数据并关闭表单
        if (res) {
          ElMessage.success(
            props.action === 'add'
              ? `添加用户 '${props.formUser.name}' 成功`
              : `修改用户 '${props.formUser.name}' 成功`,
          )
          emit('update:dialogVisible', false)
          try {
            // 调用父组件的方法更新数据列表
            await props.getUserData()
          } catch (error) {
            ElMessage.error(error.message || '更新数据列表失败，请重试')
          }
        }
      } else {
        ElMessage.error('请输入正确的内容')
      }
    })
  } catch (error) {
    ElMessage.error(error.message || '提交表单信息失败，请重试')
  }
}
</script>

<template>
  <el-dialog
    :model-value="props.dialogVisible"
    :title="props.action === 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    @close="updateDialogVisible"
  >
    <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
    <el-form
      :inline="true"
      :model="props.formUser"
      :rules="rules"
      ref="userForm"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="props.formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input
              v-model.number="props.formUser.age"
              placeholder="请输入年龄"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select v-model="props.formUser.sex" placeholder="请选择">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="props.formUser.birth"
              type="date"
              placeholder="请输入"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="props.formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="updateDialogVisible">
            取消</el-button
          >
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<style lang="less" scoped>
.select-clearn {
  display: flex;
}
</style>
