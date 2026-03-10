import request from './request'

/**
 * mock为false用的是mockData里的模拟数据
 * 这是需要取main.js中引入mock.js  import '@/api/mock.js'
 */
/**
 * mock为true用的是apifox里的接口的模拟数据
 * 无需用到mockData中的数据也不需要引入mock.js
 */

// 默认 mock:true

// 获取首页左侧表格数据
export function getTableAPI() {
  return request({
    url: '/home/getTableData',
    method: 'GET',
  })
}

// 获取首页右侧订单数据
export function getCountAPI() {
  return request({
    url: '/home/getCountData',
    method: 'GET',
  })
}
// 获取首页右侧echarts数据
export function getChartAPI() {
  return request({
    url: '/home/getChartData',
    method: 'GET',
  })
}

