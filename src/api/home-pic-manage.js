import req from '../fetch/index.js'

const config = {
  // 查询列表
  listRotationChartState: {
    // 客户端请求地址
    url: '/pc/rotationChart/listRotationChartState',
    // HTTP请求方式
    method: 'post'
  },
  // 删除
  deleteRotationChart: {
    // 客户端请求地址
    url: '/pc/rotationChart/deleteRotationChart',
    // HTTP请求方式
    method: 'post'
  },
  // 启用，禁用
  updateRotationChartState: {
    // 客户端请求地址
    url: '/pc/rotationChart/updateRotationChartState',
    // HTTP请求方式
    method: 'post'
  },
  //  新增
  addRotationChart: {
    // 客户端请求地址
    url: '/pc/rotationChart/addRotationChart',
    // HTTP请求方式
    method: 'post'
  },
  // 商品
  listRotationGoods: {
    // 客户端请求地址
    url: '/pc/rotationChart/listRotationGoods',
    // HTTP请求方式
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
