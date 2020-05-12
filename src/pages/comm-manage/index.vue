<template>
  <div>
     <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
         <el-form-item label="商品名称" prop="goodsName">
           <el-input v-model="formData.goodsName"></el-input>
         </el-form-item>
         <el-form-item label="商品状态" prop="goodsState">
           <el-select v-model="formData.goodsState" placeholder="全部">
              <el-option
              v-for="(item, index) in StateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
            </el-select>
         </el-form-item>
         <el-form-item label="广告词" prop="advert">
           <el-input v-model="formData.advert"></el-input>
         </el-form-item>
         <br>
         <el-form-item label="出版社" prop="press">
           <el-input v-model="formData.press"></el-input>
         </el-form-item>
         <el-form-item label="作者" prop="author" style="margin-right:35px">
           <el-input v-model="formData.author"></el-input>
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
        :show-overflow-tooltip="true"
         >
         <!-- 省略多余的内容 -->
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
             <el-form-item label="商品名称" prop="goodsName">
               <el-input v-model="dialogForData.goodsName"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="书号" prop="isbn">
               <el-input v-model="dialogForData.isbn"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="一级分类" prop="firstSortId">
               <el-select
               @change="SecondlistSort(dialogForData.firstSortId)"
               v-model="dialogForData.firstSortId"
               placeholder="请选择">
                <el-option
                v-for="(item, index) in firstOptions"
                :key="index"
                :label="item.sortName"
                :value="item.sortId"></el-option>
              </el-select>
             </el-form-item>
           </el-col>
           <!-- 一级分类二级分类两个种写法都可，二级分类使用了map函数遍历将后端传来的sortId和sortName转为value和label -->
           <el-col :span="12">
             <el-form-item label="二级分类" prop="secondSortId">
               <el-select v-model="dialogForData.secondSortId" placeholder="请选择">
                 <el-option
                 v-for="(item, index) in secondOptions"
                 :key="index"
                 :label="item.label"
                 :value="item.value"></el-option>
              </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="广告词" prop="advert">
               <el-input v-model="dialogForData.advert" type="textarea"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="商品介绍" prop="introduce">
               <el-input v-model="dialogForData.introduce" type="textarea"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="出版社" prop="press">
               <el-input v-model="dialogForData.press"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="作者" prop="author">
               <el-input v-model="dialogForData.author"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input v-model.number="dialogForData.stock"></el-input>
            </el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="定价" prop="fixPrice">
              <el-input v-model="dialogForData.fixPrice" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
            </el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="在售价" prop="sellingPrice">
              <el-input v-model="dialogForData.sellingPrice" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
            </el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="图片" prop="goodsImage">
              <i-file
              v-model="dialogForData.goodsImage"></i-file>
            </el-form-item>
           </el-col>
         </el-row>
       </el-form>
       </i-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .el-form {
    .el-form-item {
      .el-form-item__content {
        .el-select {
          width: 206.4px;
        }
      }
    }
  }
</style>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/comm-manage.js'
import IFile from '@/components/common/i-file.vue'

export default {
  name: 'comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile
  },
  data () {
    return {
      // 用于判断是添加还是修改
      dialogType: '',
      // 点击一级分类传一级分类编号给二级分类
      clicksortId: '',
      // 下拉框选项名
      sortName: '',
      // 获取选中行
      getUserCode: [],
      // 查询列表
      formData: {
        goodsName: '',
        goodsState: '',
        advert: '',
        press: '',
        author: ''
      },
      fileList: [1],
      // dialog弹出框列表
      dialogForData: {
        goodsName: '',
        isbn: '',
        firstSortId: '',
        secondSortId: '',
        advert: '',
        introduce: '',
        press: '',
        author: '',
        stock: '',
        fixPrice: '',
        sellingPrice: '',
        goodsImage: '',
        version: ''
      },
      dialogVisible: false,
      dialogTitle: '新增商品',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增商品'
            this.dialogType = 'addGoods'
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
              this.dialogType = 'updateGoods'
              this.goodsCode = this.getUserCode[0].goodsCode
              this.getGood()
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
                req('deleteGoods', {
                  // 将goodsCode发送后端 getUserCode等于rows,这是个数组
                  goodsCode: this.getUserCode[0].goodsCode
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
                this.goodsCode = this.getUserCode[i].goodsCode + ',' + this.goodsCode
                this.$confirm('此操作将永久删除该商品，是否继续？').then(() => {
                  req('deleteGoods', {
                    // 将userCode发送后端 getUserCode等于rows,这是个数组
                    goodsCode: this.goodsCode
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
          btnName: '上架',
          type: 'primary',
          func: () => {
            console.log('我被上架了')
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个商品')
            } else if (this.getUserCode.length === 1) {
              req('updateGoodsState', {
                goodsCode: this.getUserCode[0].goodsCode,
                goodsState: 0
              }).then(data => {
                if (data.code === 0) {
                  this.$message.success('上架成功')
                  this.search()
                } else {
                  this.$message.error('上架失败')
                }
              })
            } else {
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.goodsCode = this.getUserCode[i].goodsCode + ',' + this.goodsCode
                req('updateGoodsState', {
                  goodsCode: this.goodsCode,
                  goodsState: 0
                }).then(data => {
                  if (data.code === 0) {
                    this.$message.success('上架成功')
                    this.search()
                  } else {
                    this.$message.error('上架失败')
                  }
                })
              }
            }
          }
        },
        {
          btnName: '下架',
          type: 'primary',
          func: () => {
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个商品')
            } else if (this.getUserCode.length === 1) {
              req('updateGoodsState', {
                goodsCode: this.getUserCode[0].goodsCode,
                goodsState: 1
              }).then(data => {
                if (data.code === 0) {
                  this.$message.success('下架成功')
                  this.search()
                } else {
                  this.$message.error('下架失败')
                }
              })
            } else {
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.goodsCode = this.getUserCode[i].goodsCode + ',' + this.goodsCode
                req('updateGoodsState', {
                  goodsCode: this.goodsCode,
                  goodsState: 1
                }).then(data => {
                  if (data.code === 0) {
                    this.$message.success('下架成功')
                    this.search()
                  } else {
                    this.$message.error('下架失败')
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
      // 选择器
      StateOptions: [
        { label: '在售', value: '0' },
        { label: '已下架', value: '1' },
        { label: '未发布', value: '2' }
      ],
      // 一级分类
      firstOptions: [],
      // 二级分类
      secondOptions: [],
      columnList: [
        { label: '商品名称', prop: 'goodsName', width: 100 },
        { label: '定价', prop: 'fixPrice' },
        { label: '售价', prop: 'sellingPrice' },
        { label: '销售量', prop: 'salesVolume' },
        { label: '一级分类', prop: 'firstSortName' },
        { label: '二级分类', prop: 'secondSortName' },
        { label: '广告词', prop: 'advert', width: 200 },
        { label: '商品介绍', prop: 'introduce', width: 200 },
        { label: '商品状态', prop: 'goodsState', distName: 'StateOptions' },
        { label: '上架时间', prop: 'shelfTime', width: 200 },
        { label: '浏览量', prop: 'pageview' },
        { label: '出版社', prop: 'press', width: 200 },
        { label: '作者', prop: 'author', width: 130  },
        { label: '库存', prop: 'stock' },
        { label: 'isbn书号', prop: 'isbn', width: 200 }
      ],
      tableData: [],
      formRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: ['blur', 'change'] }
        ],
        isbn: [
          { required: true, message: '请输入书号', trigger: ['blur', 'change'] }
        ],
        firstSortId: [
          { required: true, message: '请选择一级分类', trigger: ['blur', 'change'] }
        ],
        secondSortId: [
          { required: true, message: '请选择二级分类', trigger: ['blur', 'change'] }
        ],
        advert: [
          { required: true, message: '请输入广告词', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '请输入商品介绍', trigger: ['blur', 'change'] }
        ],
        press: [
          { required: true, message: '请输入出版社', trigger: ['blur', 'change'] }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: ['blur', 'change'] }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: ['blur', 'change'] },
          { type: 'number', message: '库存必须为数字值' }
        ],
        fixPrice: [
          { required: true, message: '请输入定价', trigger: ['blur', 'change'] },
          { validator: this.validatePrice, trigger: 'change' }
        ],
        sellingPrice: [
          { required: true, message: '请输入在售价', trigger: ['blur', 'change'] },
          { validator: this.validatePrice, trigger: 'change' }
        ],
        goodsImage: [
          { required: true, message: '请添加图片' }
        ]
      }
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.fetch()
    this.FirstlistSort()
  },
  methods: {
    validatePrice (rule, value, callback) {
      const reg = /^[0-9]+(.[0-9]{1,2})?$/

      if (!reg.test(value)) {
        console.log('中了')
        callback(new Error('请输入正确的价格'))
      } else {
        console.log('没中')
        callback()
      }
    },
    // 让每次搜索都从第一页开始
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    // 一级分类传值
    FirstlistSort () {
      req('listSort', {
        sortId: 0
      }).then(data => {
        // map函数遍历数组
        this.firstOptions = data.data
        console.log('data', data)
      })
    },
    // 二级分类传值
    SecondlistSort (value) {
      this.clicksortId = value
      req('listSort', {
        sortId: this.clicksortId
      }).then(data => {
        console.log('data2', data)
        this.dialogForData.secondSortId = ''
        this.secondOptions = []
        // map函数遍历数组
        this.secondOptions = data.data.map(item => {
          return Object.assign({}, item, { label: item.sortName, value: item.sortId })
        })
      })
    },
    getGood () {
      // 服务器请求的数据
      req('getGoods', {
        goodsCode: this.goodsCode
      }).then(data => {
        // 在dialog添上服务器传来的数据
        this.dialogForData = Object.assign({}, data.data)
      })
    },
    // 查询表格数据
    search () {
      // 服务器请求数据，getTaleData详情请看usermanage.js
      req('listGoods', {
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
    // 每页条数
    handleSizeChange (value) {
      console.log('每页多少条', value)
      this.pageInfo.pageSize = value
      this.search()
    },
    // 当前页数
    handleCurrentChange (value) {
      console.log('当前多少页', value)
      this.pageInfo.pageNum = value
      this.search()
    },
    // 多选框
    handleSelectionChange (rows) {
      console.log('rows', rows)
      this.getUserCode = rows
    },
    // dialog右上角的关闭按钮
    dialogBeforeClose () {
      this.$refs.form.resetFields()
    },
    // dialog确认按钮
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addGoods') {
            req('addGoods', {
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
          } else if (this.dialogType === 'updateGoods') {
            req('updateGoods', {
              ...this.dialogForData,
              userCode: this.userCode
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
          }
        } else {
          return false
        }
      })
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    // 表格表头的循环list变量名一定要是一致的(columnList)
    // 商品状态数字和文字互转
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
