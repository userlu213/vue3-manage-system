// 对当前环境及对mock/请求的一些配置管理

const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  // 开发环境
  development: {
    baseAPI: '/api',
    mockAPI: 'http://127.0.0.1:4523/m1/7756757-7502297-default/api',
  },
  // 测试环境
  test: {
    baseAPI: '//test.future.com/api',
    mockAPI: 'http://127.0.0.1:4523/m1/7756757-7502297-default',
  },
  // 生产环境
  prod: {
    baseAPI: '//future.com/api',
    mockAPI: 'http://127.0.0.1:4523/m1/7756757-7502297-default',
  },
}

export default {
  env,
  // 是否使用mock模拟数据
  mock: false,
  ...EnvConfig[env],
}
