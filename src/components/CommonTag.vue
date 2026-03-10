<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '../stores'

const store = useAllDataStore()

// tag标签信息
const tags = computed(() => store.state.tags)
const route = useRoute()
const router = useRouter()

// 点击tag标签实现路由跳转或@click="router.push(tag.path)"
const handleMenu = (tag) => {
  // 保了路由和状态的双重同步
  store.selectMenu(tag)
  router.push(tag.name)
}

// 点击关闭tag标签
const handleClose = (tag, index) => {
  // 通过pinia管理的tag标签
  store.updateTags(tag)

  //只有当关闭的tab对应当前页面的时候，才需要做一些操作
  if (tag.name !== route.name) return

  // 点击关闭的是当前页面的tag标签
  if (index === store.state.tags.length) {
    // 更新store状态，删除最后一个tag标签并跳转至前一个tag标签对应的页面
    store.selectMenu(tags.value[index - 1])
    router.push(tags.value[index - 1].name)
  } else {
    // 如果关闭点击的tag标签不是对应的当前展示的页面 则更新store状态并将其删除
    store.selectMenu(tags.value[index])
    router.push(tags.value[index].name)
  }
}
</script>

<template>
  <div class="tags">
    <el-tag
      v-for="(tag, index) in tags"
      :closable="tag.name !== 'home'"
      :key="tag.name"
      type="primary"
      :effect="route.name === tag.name ? 'dark' : 'plain'"
      @click="handleMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<style lang="less" scoped>
.tags {
  margin: 5px 0 0 5px;
}
.el-tag {
  margin-right: 10px;
}
</style>
