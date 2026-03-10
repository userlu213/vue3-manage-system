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

// 获取用户数据列表
export function getUserAPI(data) {
  return request({
    url: '/user/getUserData',
    method: 'GET',
    // request.js添加了options.params = options.data 的配置
    // 这里就不需要使用params了
    data,
  })
}

// 删除用户数据
export function delUserAPI(data) {
  return request({
    url: '/user/delUserData',
    method: 'GET',
    data,
  })
}

// 添加用户
export function addUserAPI(data) {
  return request({
    url: '/user/addUserData',
    method: 'POST',
    data
  })
}

// 修改用户信息
export function editUserAPI(data) {
  return request({
    url: '/user/editUserData',
    method: 'POST',
    data
  })
}
