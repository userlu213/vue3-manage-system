import Mock from 'mockjs'
import homeAPI from './homeData'
import userAPI from './userData'
import permissionAPI from './permissionData'

// 正则表达式精确匹配接口路径
Mock.mock(/api\/home\/getTableData/, 'get', homeAPI.getTableData)
Mock.mock(/api\/home\/getCountData/, 'get', homeAPI.getCountData)
Mock.mock(/api\/home\/getChartData/, 'get', homeAPI.getChartData)

Mock.mock(/api\/user\/getUserData/, 'get', userAPI.getUserList)
Mock.mock(/api\/user\/delUserData/, 'get', userAPI.deleteUser)
Mock.mock(/api\/user\/addUserData/, 'post', userAPI.createUser)
Mock.mock(/api\/user\/editUserData/, 'post', userAPI.updateUser)

Mock.mock(/api\/permission\/getMenu/, 'post', permissionAPI.getMenu)
