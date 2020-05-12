<template>
  <div>
     <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
         <el-form-item label="商品名称" prop="goodsName">
           <el-input v-model="formData.goodsName"></el-input>
         </el-form-item>
         <el-form-item label="商品编号" prop="goodsCode">
           <el-input v-model="formData.goodsCode"></el-input>
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
         :show-overflow-tooltip="true"
         >
         <!-- 省略多余内容 -->
         </el-table-column>
       </i-table>

       <i-dialog
       v-model="dialogVisible"
       :title="dialogTitle"
       @dialog-before-close="dialogBeforeClose"
       @dialog-confirm="dialogConfirm"
       @dialog-cancel="dialogCancel">
       <el-form label-width="100px" :model="dialogForData" ref="form" :rules="formRules">
         <el-row>
           <el-col :span="12">
             <el-form-item label="商品" prop="goodsCode">
               <comm-select v-model="dialogForData.goodsCode"></comm-select>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="热门位排序" prop="hotSort">
               <el-input v-model.number="dialogForData.hotSort"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
       </el-form>
       </i-dialog>

       <i-dialog
       v-model="dialogVisibles"
       :title="dialogTitles"
       @dialog-before-close="dialogBeforeClose"
       @dialog-confirm="dialogConfirm"
       @dialog-cancel="dialogCancel">
       <el-form label-width="120px" :model="dialogForData" ref="form" :rules="formRules">
         <el-row>
           <el-col :span="12">
             <el-form-item label="数量展示设置" prop="hotGoodsNum">
               <el-input v-model.number="dialogForData.hotGoodsNum"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
       </el-form>
       </i-dialog>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import CommSelect from './comm-select'
import req from '@/api/hot-comm-manage.js'

export default {
  name: 'hot-comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect
  },
  data () {
    return {
      getUserCode: '',
      formData: {
        goodsName: '',
        goodsCode: ''
      },
      fileList: [1],
      dialogForData: {
        goodsCode: '',
        hotSort: '',
        hotGoodsNum: ''
      },
      dialogVisible: false,
      // 展示数量弹框
      dialogVisibles: false,
      dialogTitles: '数量展示设置',
      dialogTitle: '',
      dialogType: '',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增商品'
            this.dialogType = 'addHotGoods'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getUserCode.length === 0) {
              this.$message.error('请至少勾选一个商品')
            } else if (this.getUserCode.length === 1) {
              this.dialogVisible = true
              this.dialogTitle = '修改商品'
              this.dialogType = 'updateHotGoods'
              this.hotId = this.getUserCode[0].hotId
              this.getHotGoods()
            } else {
              // 错误提示信息
              this.$message.error('至多勾选一个商品')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            // 未勾选
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个商品')
            } else if (this.getUserCode.length === 1) {
              // 删一个
              // then回调函数，点确认才会触发
              this.$confirm('此操作将永久删除该商品，是否继续？').then(() => {
                req('deleteHotGoods', {
                  // 将goodsCode发送后端 getUserCode等于rows,这是个数组
                  hotId: this.getUserCode[0].hotId
                }).then(data => {
                  // 返回0删除成功
                  if (data.code === 0) {
                    this.search()
                    this.$message.success(data.msg)
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              })
            } else {
              // 删多个
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.hotId = this.getUserCode[i].hotId + ',' + this.hotId
                this.$confirm('此操作将永久删除该商品，是否继续？').then(() => {
                  req('deleteHotGoods', {
                    // 将userCode发送后端 getUserCode等于rows,这是个数组
                    hotId: this.hotId
                  }).then(data => {
                    // 返回0删除成功
                    if (data.code === 0) {
                      this.search()
                      // 成功提示信息
                      this.$message.success(data.msg)
                    }
                  })
                })
              }
            }
          }
        },
        {
          btnName: '展示数量设置',
          type: 'primary',
          func: () => {
            this.dialogVisibles = true
            this.dialogType = 'updateHotGoodsNum'
            this.getHotGoodsNum()
          }
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      columnList: [
        { label: '排序', prop: 'hotSort' },
        { label: '商品编号', prop: 'goodsCode' },
        { label: '商品名称', prop: 'goodsName' },
        { label: '商品价格', prop: 'sellingPrice' },
        { label: '商品介绍', prop: 'introduce', width: 300 }
      ],
      tableData: [],
      formRules: {
        goodsCode: [
          { required: true, message: '请选择商品', trigger: ['blur', 'change'] }
        ],
        hotSort: [
          { required: true, message: '请输入热门位排序', trigger: ['blur', 'change'] },
          { type: 'number', message: '热门位排序必须为数字值' }
        ],
        hotGoodsNum: [
          { required: true, message: '请输入展示数量', trigger: ['blur', 'change'] },
          { type: 'number', message: '展示数量必须为数字值' }
        ]
      }
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.fetch()
  },
  methods: {
    // 让每次搜索都从第一页开始
    fetch () {
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      // 服务器请求数据，getTaleData详情请看usermanage.js
      req('listHotGoods', {
        // 发送formData整个对象
        ...this.formData,
        // 每页多少条
        pageSize: this.pageInfo.pageSize,
        // 当前页数
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        console.log(data)
        // 获取服务器响应数据
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    reset () {

    },
    getHotGoodsNum () {
      req('getHotGoodsNum', {

      }).then(data => {
        console.log('展示数量', data.data)
        // 在dialog添上服务器传来的数据
        this.dialogForData.hotGoodsNum = data.data
      })
    },
    getHotGoods () {
      // 服务器请求的数据
      req('getHotGoods', {
        hotId: this.hotId
      }).then(data => {
        // 在dialog添上服务器传来的数据
        this.dialogForData = Object.assign({}, data.data)
      })
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
    dialogBeforeClose () {
      console.log('你老妈')
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addHotGoods') {
            req('addHotGoods', {
              ...this.dialogForData
            }).then(data => {
              if (data.code === 0) {
                this.dialogVisible = false
                this.$message.success(data.msg)
                this.fetch()
                // 提交成功后清楚数据以及图片
                this.$refs.form.resetFields()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'updateHotGoods') {
            req('updateHotGoods', {
              ...this.dialogForData,
              hotId: this.hotId
            }).then(data => {
              if (data.code === 0) {
                this.dialogVisible = false
                this.$message.success(data.msg)
                this.fetch()
                this.$refs.form.resetFields()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'updateHotGoodsNum') {
            req('updateHotGoodsNum', {
              hotGoodsNum: this.dialogForData.hotGoodsNum
            }).then(data => {
              if (data.code === 0) {
                this.dialogVisibles = false
                this.$message.success(data.msg)
                this.$refs.form.resetFields()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    dialogCancel () {
      this.dialogVisible = false
      this.dialogVisibles = false
      this.$refs.form.resetFields()
    },
    // 热们位商品选择页面取消按钮
    dialogCancel2 () {
      this.dialogVisibles = false
      this.$refs.form.resetFields()
    },
    // 热们位商品选择页面确定按钮
    dialogShop () {
      console.log('热们位商品提交了')
      this.dialogVisibles = false
    },
    // 图片选择
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
