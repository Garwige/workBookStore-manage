import req from '../fetch/index.js'

const config = {
  // 查询列表详情
  getGoodsSort: {
    // 客户端请求地址
    url: '/pc/goodsSort/getGoodsSort',
    // HTTP请求方式
    method: 'post'
  },
  // 查询列表
  listGoodsSort: {
    // 客户端请求地址
    url: '/pc/goodsSort/listGoodsSort',
    // HTTP请求方式
    method: 'post'
  },
  // 新增
  addGoodsSort: {
    // 客户端请求地址
    url: '/pc/goodsSort/addGoodsSort',
    // HTTP请求方式
    method: 'post'
  },
  // 修改
  updateGoodsSort: {
    // 客户端请求地址
    url: '/pc/goodsSort/updateGoodsSort',
    // HTTP请求方式
    method: 'post'
  },
  // 删除
  deleteGoodsSort: {
    // 客户端请求地址
    url: '/pc/goodsSort/deleteGoodsSort',
    // HTTP请求方式
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
