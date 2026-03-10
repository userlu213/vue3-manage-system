<script setup lang="ts">
import { onMounted, ref, reactive, onUnmounted } from 'vue'
import { getTableAPI, getCountAPI, getChartAPI } from '../api/home'
import { getImageUrl } from '@/utils/getImageUrl'
// 引入echarts
import * as echarts from 'echarts'

// 表格数据
const tableData = ref([])
const tableLabel = ref({})

// 订单数据
const countData = ref([])

// echarts数据
const echartData = ref({})
// 创建echarts图表实例对象
const orderEchart = ref(null)
const userEchart = ref(null)
const videoEchart = ref(null)

// 模拟获取表格数据
const getTableData = async () => {
  try {
    const res = await getTableAPI()
    tableData.value = res.tableData
    tableLabel.value = res.tableLabel
  } catch (error) {
    ElMessage.error(error.message || '获取表格数据失败，请重试')
  }
}

// 获取订单数据
const getCountData = async () => {
  try {
    const res = await getCountAPI()
    countData.value = res
  } catch (error) {
    ElMessage.error(error.message || '获取订单数据失败，请重试')
  }
}

// 获取echarts图表数据并创建echarts图表
const getChartData = async () => {
  try {
    const { orderData, userData, videoData } = await getChartAPI()
    // 折线图赋值
    xOptions.xAxis.data = orderData.date
    xOptions.series = Object.keys(orderData.data[0]).map((val) => {
      return {
        name: val,
        data: orderData.data.map((item) => item[val]),
        type: 'line',
      }
    })
    const firstEchart = echarts.init(orderEchart.value)
    firstEchart.setOption(xOptions)

    // 柱状图赋值
    xOptions.xAxis.data = userData.map((item) => item.date)
    xOptions.series = [
      {
        name: '新增用户',
        data: userData.map((item) => item.new),
        type: 'bar',
      },
      {
        name: '活跃用户',
        data: userData.map((item) => item.active),
        type: 'bar',
      },
    ]
    const secondEchart = echarts.init(userEchart.value)
    secondEchart.setOption(xOptions)

    // 饼状图赋值
    pieOptions.series = [
      {
        data: videoData,
        type: 'pie',
      },
    ]
    const thirdEchart = echarts.init(videoEchart.value)
    thirdEchart.setOption(pieOptions)

    // 监听echarts图表大小的变化
    observer.value = new ResizeObserver((e) => {
      firstEchart.resize()
      secondEchart.resize()
      thirdEchart.resize()
    })
    // 容器存在时
    if (orderEchart) {
      observer.value.observe(orderEchart.value)
    }
  } catch (error) {
    ElMessage.error(error.message || '获取图表数据失败，请重试')
  }
}

/**
 * echarts图表
 */
// observer 接收观察器实例对象
const observer = ref(null)
// 折线图和柱状图 两个图表共用的公共配置
const xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: '#333',
  },
  legend: {},
  // 边框布局配置
  grid: {
    left: '5%',
    right: '1%',
    top: '10%',
  },
  // 提示框
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category', // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: '#17b3a3',
      },
    },
    axisLabel: {
      interval: 0,
      color: '#333',
    },
  },
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#17b3a3',
        },
      },
    },
  ],
  color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
  series: [],
})
// 饼状图
const pieOptions = reactive({
  tooltip: {
    trigger: 'item',
  },
  legend: {},
  color: [
    '#0f78f4',
    '#dd536b',
    '#9462e5',
    '#a6a6a6',
    '#e1bb22',
    '#39c362',
    '#3ed1cf',
  ],
  series: [],
})

onMounted(() => {
  getTableData()
  getCountData()
  getChartData()
})

// 在组件销毁时销毁echarts图表，避免内存泄漏
// onUnmounted(() => {
//   if (orderChart) orderChart.dispose()
//   if (userChart) userChart.dispose()
//   if (videoChart) videoChart.dispose()
// })
</script>

<template>
  <el-row class="home" :gutter="20">
    <!-- 首页左侧 -->
    <el-col :span="8">
      <!-- 用户信息卡片 -->
      <el-card shadow="hover">
        <div class="user">
          <img :src="getImageUrl('user')" class="user-img" />
          <div class="user-info">
            <p class="user-info-name">Admin</p>
            <p class="user-info-role">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登陆时间:<span>2026-1-1</span></p>
          <p>上次登陆地点:<span>北京</span></p>
        </div>
      </el-card>
      <!-- 左侧表格信息卡片 -->
      <el-card shadow="hover" class="user-table">
        <el-table :data="tableData" border>
          <el-table-column
            v-for="(item, key) in tableLabel"
            :key="item"
            :prop="key"
            :label="item"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <!-- 首页右侧 -->
    <el-col :span="16">
      <!-- 订单卡片信息 -->
      <div class="order">
        <el-card
          shadow="hover"
          :body-style="{ display: 'flex', padding: 0 }"
          v-for="item in countData"
          :key="item.name"
        >
          <component
            class="icons"
            :is="item.icon"
            :style="{ background: item.color }"
          />
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!-- 折线图 -->
      <div ref="orderEchart" style="height: 220px" class="top-echart"></div>
      <!-- 柱状图 饼状图 -->
      <div class="graph">
        <!-- 柱状图 -->
        <el-card shadow="hover">
          <div ref="userEchart" style="height: 240px"></div>
        </el-card>
        <!-- 饼状图 -->
        <el-card shadow="hover">
          <div ref="videoEchart" style="height: 240px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.home {
  height: 100%;
  overflow: hidden;
  .user,
  .user-img {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    .user-info {
      p {
        line-height: 40px;
      }
      .user-info-name {
        font-size: 35px;
        margin-bottom: 10px;
      }
      .user-info-role {
        font-size: 18px;
        color: #666;
      }
    }
  }
  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span {
        margin-left: 30px;
        color: #666;
      }
    }
  }
  .user-table {
    margin-top: 20px;
  }
  .order {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icons {
      width: 60px;
      height: 60px;
      align-items: center;
      color: #fff;
    }
    .detail {
      margin-left: 15px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      .num {
        font-size: 30px;
        margin-bottom: 15px;
      }
      .txt {
        font-size: 15px;
        color: #999;
      }
    }
  }
  .graph {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    .el-card {
      width: 48%;
      height: auto;
    }
  }
  .top-echart {
    background-color: #fff;
    transition: box-shadow 0.3s;
    border-radius: 4px;
  }
  .top-echart:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
