import req from '../fetch/index.js'

const config = {
  // portExport: {
  //   url: '/api/media/stimulate/exportExcel',
  //   method: 'post',
  //   fileConfig: {
  //     type: 'file',
  //     fileName: '销售激励报表'
  //   }
  // },
  getTableData: {
    // 客户端请求地址
    url: '/pc/user/listUsers',
    // HTTP请求方式
    method: 'post'
  },
  deleteUser: {
    url: '/pc/user/deleteUser',
    method: 'post'
  },
  addUser: {
    url: '/pc/user/addUser',
    method: 'post'
  },
  updateUser: {
    url: '/pc/user/updateUser',
    method: 'post'
  },
  getUser: {
    url: '/pc/user/getUser',
    method: 'post'
  }

}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
