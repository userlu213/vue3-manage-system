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


export function getMenu(params) {
  return request({
    url: '/permission/getMenu',
    method: 'post',
    data:params
  })
}