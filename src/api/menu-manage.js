import req from '../fetch/index.js'

const config = {
  // 查询列表详情
  getMenu: {
    // 客户端请求地址
    url: '/pc/menu/getMenu',
    // HTTP请求方式
    method: 'post'
  },
  // 查询列表
  listMenu: {
    // 客户端请求地址
    url: '/pc/menu/listMenu',
    // HTTP请求方式
    method: 'post'
  },
  // 修改列表
  updateMenu: {
    // 客户端请求地址
    url: '/pc/menu/updateMenu',
    // HTTP请求方式
    method: 'post'
  },
  // 新增
  addMenu: {
    // 客户端请求地址
    url: '/pc/menu/addMenu',
    // HTTP请求方式
    method: 'post'
  },
  // 删除
  deleteMenu: {
    // 客户端请求地址
    url: '/pc/menu/deleteMenu',
    // HTTP请求方式
    method: 'post'
  },
  // 根据角色查询首页菜单列表
  listMenuHome: {
    // 客户端请求地址
    url: '/pc/menu/listMenuHome',
    // HTTP请求方式
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
