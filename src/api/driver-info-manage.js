import req from '../fetch/index.js'

const config = {
  // 查询列表
  listDriver: {
    // 客户端请求地址
    url: '/pc/driver/listDriver',
    // HTTP请求方式
    method: 'post'
  },
  // 查询省市区
  listArea: {
    // 客户端请求地址
    url: '/pc/store/listArea',
    // HTTP请求方式
    method: 'post'
  },
  // 查询司机详情
  getDriver: {
    // 客户端请求地址
    url: '/pc/driver/getDriver',
    // HTTP请求方式
    method: 'post'
  },
  // 添加
  addDriver: {
    // 客户端请求地址
    url: '/pc/driver/addDriver',
    // HTTP请求方式
    method: 'post'
  },
  updateDriver: {
    // 客户端请求地址
    url: '/pc/driver/updateDriver',
    // HTTP请求方式
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
