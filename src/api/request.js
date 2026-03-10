import axios from 'axios'
import { ElMessage } from 'element-plus'
import config from '../config'

const service = axios.create({
  baseURL: config.baseAPI,
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const { data, code, msg, message } = res.data
    if (code === 200) {
      return data
    } else {
      ElMessage.error(message || msg || '请求失败，请稍后重试')
      return Promise.reject(message || msg || '请求失败，请稍后重试')
    }
  },
  (error) => {
    // 网络错误提示
    ElMessage.error(error.message || '网络错误，请稍后重试')
    return Promise.reject(error)
  },
)

// 配置函数
function request(options) {
  options.method = options.method || 'GET'

  // 关于get请求参数的调整
  if (options.method.toLowerCase() === 'get') {
    // 将携带参数的data转换为params
    options.params = options.data
  }

  // 对mock的开关做一个处理
  let isMock = config.mock
  // 判断请求的api函数中是否有mock参数(这里的数据是否需要用到模拟数据)
  // 有则将api函数中的mock参数赋值给isMock，并通过mock请求获取数据
  // 无则进行下一步操作(请求真实的后端接口)
  if (typeof options.mock !== 'undefined') {
    isMock = options.mock
  }

  // 针对环境做一个处理
  let baseURL = ''
  if (config.env === 'prod') {
    // 如果为生产环境 不能用mock 则使用基地址
    baseURL = config.baseAPI
  } else {
    // 不为生产环境则根据isMock来判断是否要启用mock
    baseURL = isMock ? config.mockAPI : config.baseAPI
  }
  return service({ ...options, baseURL })
}

export default request
