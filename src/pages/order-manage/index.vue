<template>
  <div>
     <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
         <el-form-item label="下单人" prop="userName">
           <el-input v-model="formData.userName"></el-input>
         </el-form-item>
         <el-form-item label="订单编码" prop="orderCode">
           <el-input v-model="formData.orderCode"></el-input>
         </el-form-item>
         <el-form-item label="付款时间起" prop="payTimeBegin">
            <el-date-picker type="date" placeholder="选择日期" v-model="formData.payTimeBegin"></el-date-picker>
          </el-form-item>
          <el-form-item label="付款时间止" prop="payTimeEnd">
            <el-date-picker placeholder="选择日期" v-model="formData.payTimeEnd"></el-date-picker>
          </el-form-item>
         <el-form-item label="手机号" prop="phone" label-width="77px">
           <el-input v-model.number="formData.phone"></el-input>
         </el-form-item>
         <el-form-item label="订单状态" prop="orderState">
           <el-select v-model="formData.orderState">
             <el-option
             v-for="(item, index) in orderStateOptions"
             :key="index"
             :label="item.label"
             :value="item.value"></el-option>
           </el-select>
         </el-form-item>
       </i-search>
       <i-table
        :toolbar="toolbar"
        :tableData="tableData"
        :pageInfo="pageInfo"
        :selectionShow="true"
        @selection-change="handleSelectionChange"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange">
         <el-table-column
         v-for="(item, index) in columnList"
         :key="index"
         :label="item.label"
         :width="item.width"
         :prop="item.prop"
         align="center"
         :formatter="columnFormatter"
         >
         </el-table-column>
       </i-table>

       <el-dialog
       v-model="dialogVisible"
       :title="dialogTitle"
       :visible.sync="dialogVisible"
       @dialog-cancel="dialogCancel">
        <el-table border :data="orderData" fixed="right" height="400">
          <el-table-column
          v-for="(item, index) in orderItem"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center"
          :width="item.width"
          >
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogCancel">关闭</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.i-search {
    .el-form {
    /deep/ .el-form-item {
      .el-form-item__content {
        .el-select {
          width: 206.4px;
        }
      }
    }
  }
}

.i-search .el-form[data-v-6a5e5d60] .el-form-item .el-form-item__label {
    width: 90px;
}
</style>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import req from '@/api/order-manage.js'

export default {
  name: 'order-manage',
  components: {
    ISearch,
    ITable
  },
  data () {
    return {
      getUserCode: '',
      formData: {
        userName: '',
        orderCode: '',
        payTimeBegin: '',
        payTimeEnd: '',
        phone: '',
        orderState: ''
      },
      dialogForData: {
        userCode: '',
        orderCode: '',
        goodsCode: '',
        goodsName: '',
        buyNum: '',
        totalNum: '',
        sellingPrice: '',
        fixPrice: ''
      },
      dialogVisible: false,
      dialogTitle: '订单详情',
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            if (this.getUserCode.length === 0) {
              this.$message.error('请至少勾选一个订单')
            } else if (this.getUserCode.length === 1) {
              this.dialogVisible = true
              this.getListOrder()
            } else {
              // 错误提示信息
              this.$message.error('至多勾选一个订单')
            }
          }
        },
        {
          btnName: '订单取消',
          type: 'primary',
          func: () => {
            // 未勾选
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个订单')
            } else if (this.getUserCode.length === 1) {
              req('updateOrderState', {
                orderState: 5,
                orderCode: this.getUserCode[0].orderCode
              }).then(data => {
                // 返回0删除成功
                if (data.code === 0) {
                  this.$message.success(data.msg)
                  this.fetch()
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              // 删多个
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.orderCode = this.getUserCode[i].orderCode + ',' + this.orderCode
                req('updateOrderState', {
                  orderCode: this.orderCode,
                  orderState: 5
                }).then(data => {
                  // 返回0删除成功
                  if (data.code === 0) {
                    this.$message.success(data.msg)
                    this.fetch()
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            }
          }
        },
        {
          btnName: '订单到货',
          type: 'primary',
          func: () => {
            // 未勾选
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个订单')
            } else if (this.getUserCode.length === 1) {
              req('updateOrderState', {
                orderState: 1,
                orderCode: this.getUserCode[0].orderCode
              }).then(data => {
                // 返回0删除成功
                if (data.code === 0) {
                  this.$message.success(data.msg)
                  this.fetch()
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.orderCode = this.getUserCode[i].orderCode + ',' + this.orderCode
                req('updateOrderState', {
                  orderState: 1,
                  orderCode: this.orderCode
                }).then(data => {
                  if (data.code === 0) {
                    this.$message.success(data.msg)
                    this.fetch()
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            }
          }
        },
        {
          btnName: '取消到货',
          type: 'primary',
          func: () => {
            // 未勾选
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个订单')
            } else if (this.getUserCode.length === 1) {
              req('updateOrderState', {
                orderState: 0,
                orderCode: this.getUserCode[0].orderCode
              }).then(data => {
                // 返回0删除成功
                if (data.code === 0) {
                  this.$message.success(data.msg)
                  this.fetch()
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              // 删多个
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.orderCode = this.getUserCode[i].orderCode + ',' + this.orderCode
                req('updateOrderState', {
                  orderState: 0,
                  orderCode: this.orderCode
                }).then(data => {
                  // 返回0删除成功
                  if (data.code === 0) {
                    this.$message.success(data.msg)
                    this.fetch()
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            }
          }
        },
        {
          btnName: '订单已取货',
          type: 'primary',
          func: () => {
            // 未勾选
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个订单')
            } else if (this.getUserCode.length === 1) {
              req('updateOrderState', {
                orderState: 2,
                orderCode: this.getUserCode[0].orderCode
              }).then(data => {
                // 返回0删除成功
                if (data.code === 0) {
                  this.$message.success(data.msg)
                  this.fetch()
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              // 删多个
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.orderCode = this.getUserCode[i].orderCode + ',' + this.orderCode
                req('updateOrderState', {
                  orderState: 2,
                  orderCode: this.orderCode
                }).then(data => {
                  // 返回0删除成功
                  if (data.code === 0) {
                    this.$message.success(data.msg)
                    this.fetch()
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            }
          }
        },
        {
          btnName: '取消已取货',
          type: 'primary',
          func: () => {
            // 未勾选
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个订单')
            } else if (this.getUserCode.length === 1) {
              req('updateOrderState', {
                orderState: 1,
                orderCode: this.getUserCode[0].orderCode
              }).then(data => {
                // 返回0删除成功
                if (data.code === 0) {
                  this.$message.success(data.msg)
                  this.fetch()
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              // 删多个
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.orderCode = this.getUserCode[i].orderCode + ',' + this.orderCode
                req('updateOrderState', {
                  orderState: 1,
                  orderCode: this.orderCode
                }).then(data => {
                  // 返回0删除成功
                  if (data.code === 0) {
                    this.$message.success(data.msg)
                    this.fetch()
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            }
          }
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      orderItem: [
        { label: '用户id', prop: 'userCode', width: 200 },
        { label: '订单编码', prop: 'orderCode', width: 200 },
        { label: '商品编码', prop: 'goodsCode', width: 200 },
        { label: '商品名称', prop: 'goodsName' },
        { label: '购买数量', prop: 'buyNum' },
        { label: '总金额', prop: 'totalNum' },
        { label: '售价', prop: 'sellingPrice' },
        { label: '定价', prop: 'fixPrice' }
      ],
      orderData: [],
      // 订单状态选择框
      orderStateOptions: [
        { label: '已下单', value: '0' },
        { label: '已到货', value: '1' },
        { label: '已取货', value: '2' },
        { label: '已完成未评价', value: '3' },
        { label: '已完成已评价', value: '4' },
        { label: '已取消', value: '5' }
      ],
      columnList: [
        { label: '订单编码', prop: 'orderCode', width: 200 },
        { label: '订单总价', prop: 'orderAmount' },
        { label: '订单状态', prop: 'orderState', distName: 'orderStateOptions' },
        { label: '门店编码', prop: 'storeId', width: 200 },
        { label: '下单人姓名', prop: 'userName' },
        { label: '下单人手机号', prop: 'phone', width: 120 },
        { label: '确认付款时间', prop: 'orderTime', width: 200 }
      ],
      tableData: []
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.fetch()
  },
  methods: {
    // 详情
    getListOrder () {
      req('getListOrder', {
        orderCode: this.getUserCode[0].orderCode
      }).then(data => {
        this.orderData = data.data
      })
    },
    // 让每次搜索都从第一页开始
    fetch () {
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      // 服务器请求数据，getTaleData详情请看usermanage.js
      req('listOrder', {
        // 发送formData整个对象
        ...this.formData,
        // 每页多少条
        pageSize: this.pageInfo.pageSize,
        // 当前页数
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        // 获取服务器响应数据
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    reset () {
      console.log('重置按钮被点击了')
    },
    // 每页条数
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    // 当前页数
    handleCurrentChange (value) {
      this.pageInfo.pageNum = value
      this.search()
    },
    handleSelectionChange (rows) {
      console.log('rows', rows)
      this.getUserCode = rows
    },
    dialogCancel () {
      this.dialogVisible = false
    },
    // 表格表头的循环list变量名一定要是一致的(columnList)
    // 订单状态数字和文字互转
    columnFormatter (row, column, cellValue, index) {
      const distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        console.log('label', this.label)
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
