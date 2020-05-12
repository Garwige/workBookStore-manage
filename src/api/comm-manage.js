import req from '../fetch/index.js'

const config = {
  // 查询列表
  listGoods: {
    // 客户端请求地址
    url: '/pc/goods/listGoods',
    // HTTP请求方式
    method: 'post'
  },
  // 删除
  deleteGoods: {
    url: '/pc/goods/deleteGoods',
    method: 'post'
  },
  // 下拉框
  listSort: {
    url: '/pc/goods/listSort',
    method: 'post'
  },
  // 添加
  addGoods: {
    url: '/pc/goods/addGoods',
    method: 'post'
  },
  // 修改
  updateGoods: {
    url: '/pc/goods/updateGoods',
    method: 'post'
  },
  // 修改时返回数据给弹出框
  getGoods: {
    url: '/pc/goods/getGoods',
    method: 'post'
  },
  // 上下架
  updateGoodsState: {
    url: '/pc/goods/updateGoodsState',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
