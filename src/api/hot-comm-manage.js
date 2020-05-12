import req from '../fetch/index.js'

const config = {
  // 查询列表
  listHotGoods: {
    // 客户端请求地址
    url: '/pc/hotGoods/listHotGoods',
    // HTTP请求方式
    method: 'post'
  },
  // 新增
  addHotGoods: {
    // 客户端请求地址
    url: '/pc/hotGoods/addHotGoods',
    // HTTP请求方式
    method: 'post'
  },
  // 修改
  updateHotGoods: {
    // 客户端请求地址
    url: '/pc/hotGoods/updateHotGoods',
    // HTTP请求方式
    method: 'post'
  },
  // 查询列表详情
  getHotGoods: {
    // 客户端请求地址
    url: '/pc/hotGoods/getHotGoods',
    // HTTP请求方式
    method: 'post'
  },
  // 查询展示数量
  getHotGoodsNum: {
    // 客户端请求地址
    url: '/pc/hotGoods/getHotGoodsNum',
    // HTTP请求方式
    method: 'post'
  },
  // 修改展示数量
  updateHotGoodsNum: {
    // 客户端请求地址
    url: '/pc/hotGoods/updateHotGoodsNum',
    // HTTP请求方式
    method: 'post'
  },
  // 删除
  deleteHotGoods: {
    // 客户端请求地址
    url: '/pc/hotGoods/deleteHotGoods',
    // HTTP请求方式
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
