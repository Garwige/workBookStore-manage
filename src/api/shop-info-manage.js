import req from '../fetch/index.js'

const config = {
  // 查询列表详情
  getStore: {
    // 客户端请求地址
    url: '/pc/store/getStore',
    // HTTP请求方式
    method: 'post'
  },
  // 查询列表
  listStore: {
    // 客户端请求地址
    url: '/pc/store/listStore',
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
  // 添加
  addStore: {
    // 客户端请求地址
    url: '/pc/store/addStore',
    // HTTP请求方式
    method: 'post'
  },
  // 修改
  updateStore: {
    // 客户端请求地址
    url: '/pc/store/updateStore',
    // HTTP请求方式
    method: 'post'
  },
  // 查询用户列表详情
  // eslint-disable-next-line no-dupe-keys
  getStore: {
    // 客户端请求地址
    url: '/pc/store/getStore',
    // HTTP请求方式
    method: 'post'
  },
  deleteStore: {
    // 客户端请求地址
    url: '/pc/store/deleteStore',
    // HTTP请求方式
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
