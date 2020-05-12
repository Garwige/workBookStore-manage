import req from '../fetch/index.js'

const config = {
  // 查询列表详情
  getListOrder: {
    // 客户端请求地址
    url: '/pc/order/getListOrder',
    // HTTP请求方式
    method: 'post'
  },
  // 查询列表
  listOrder: {
    // 客户端请求地址
    url: '/pc/order/listOrder',
    // HTTP请求方式
    method: 'post'
  },
  // 修改列表
  updateOrderState: {
    // 客户端请求地址
    url: '/pc/order/updateOrderState',
    // HTTP请求方式
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
