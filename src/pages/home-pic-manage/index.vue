<template>
  <div>
     <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
         <el-form-item label="状态" prop="chartState">
           <el-select v-model="formData.chartState">
             <el-option
             v-for="(item, index) in chartStateOptions"
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
         :prop="item.prop"
         align="center"
         :formatter="columnFormatter"
         :show-overflow-tooltip="true"
         >
         <!-- 省略多余的内容 -->
         <!-- 图片预览 -->
         <template slot-scope="scope">
           <el-button v-if="item.prop === 'watch'" type="text" @click="watchImg(scope.row)">预览</el-button>
           <span v-else>{{ filterDist(scope.row[item.prop], item) }}</span>
         </template>
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
             <el-form-item label="轮播图片" prop="chartImage">
              <i-file
              v-model="dialogForData.chartImage"></i-file>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="排序" prop="sort">
               <el-input v-model.number="dialogForData.sort"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="有效期起" prop="termValidityBegin">
               <el-date-picker
               type="date"
               v-model="dialogForData.termValidityBegin"
               :picker-options="start"></el-date-picker>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="有效期止" prop="termValidityEnd">
               <el-date-picker
               type="date"
               v-model="dialogForData.termValidityEnd"
               :picker-options="end"></el-date-picker>
             </el-form-item>
           </el-col>
           <el-col :span="12">
            <!-- <el-button @click="Selection" type="primary" style="margin-left: 10px;">选择</el-button> -->
            <el-form-item label="商品" prop="goodsCode">
              <comm-select
              v-model="dialogForData.goodsCode"></comm-select>
            </el-form-item>
           </el-col>
         </el-row>
       </el-form>
       </i-dialog>

  </div>
</template>

<style lang="scss" scoped>
.i-search {
  .el-form-item {
    .el-input {
      width: 170px;
    }
  }
}
</style>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import CommSelect from './comm-select'
import IFile from '@/components/common/i-file.vue'
import req from '@/api/home-pic-manage.js'
import moment from 'moment'

export default {
  name: 'home-pic-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect,
    IFile
  },
  data () {
    return {
      dialogType: '',
      getUserCode: [],
      // 状态启用禁用
      chartStateOptions: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 }
      ],
      formData: {},
      dialogForData: {
        chartImage: '',
        sort: '',
        termValidityBegin: '',
        termValidityEnd: '',
        goodsCode: ''
      },
      start: {
        disabledDate: (value) => {
          if (this.dialogForData.termValidityEnd !== '') {
            return this.dialogForData.termValidityEnd < value
          }
        }
      },
      end: {
        disabledDate: (value) => {
          return this.dialogForData.termValidityBegin > value
        }
      },
      dialogVisible: false,
      // dialogVisibles: false,
      dialogTitle: '',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增轮播图'
            this.dialogType = 'addRotationChart'
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            // 未勾选
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个图片')
            } else if (this.getUserCode.length === 1) {
              // 删一个
              // then回调函数，点确认才会触发
              this.$confirm('此操作将永久删除该图片，是否继续？').then(() => {
                req('deleteRotationChart', {
                  // 将goodsCode发送后端 getUserCode等于rows,这是个数组
                  chartId: this.getUserCode[0].chartId
                }).then(data => {
                  // 返回0删除成功
                  if (data.code === 0) {
                    this.fetch()
                    this.$message.success(data.msg)
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              })
            } else {
              // 删多个
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.chartId = this.getUserCode[i].chartId + ',' + this.chartId
                this.$confirm('此操作将永久删除该商品，是否继续？').then(() => {
                  req('deleteRotationChart', {
                    // 将userCode发送后端 getUserCode等于rows,这是个数组
                    chartId: this.chartId
                  }).then(data => {
                    // 返回0删除成功
                    if (data.code === 0) {
                      this.fetch()
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
          btnName: '启用',
          type: 'primary',
          func: () => {
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个图片')
            } else if (this.getUserCode.length === 1) {
              req('updateRotationChartState', {
                chartId: this.getUserCode[0].chartId,
                chartState: 0
              }).then(data => {
                if (data.code === 0) {
                  this.$message.success('启用成功')
                  this.search()
                } else {
                  this.$message.error('启用失败')
                }
              })
            } else {
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.chartId = this.getUserCode[i].chartId + ',' + this.chartId
                req('updateRotationChartState', {
                  chartId: this.chartId,
                  chartState: 0
                }).then(data => {
                  if (data.code === 0) {
                    this.$message.success('启用成功')
                    this.search()
                  } else {
                    this.$message.error('启用失败')
                  }
                })
              }
            }
          }
        },
        {
          btnName: '禁用',
          type: 'primary',
          func: () => {
            if (this.getUserCode.length === 0) {
              // 错误弹窗
              this.$message.error('请勾选至少一个图片')
            } else if (this.getUserCode.length === 1) {
              req('updateRotationChartState', {
                chartId: this.getUserCode[0].chartId,
                chartState: 1
              }).then(data => {
                if (data.code === 0) {
                  this.$message.success('禁用成功')
                  this.search()
                } else {
                  this.$message.error('禁用失败')
                }
              })
            } else {
              // 禁用多个
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.chartId = this.getUserCode[i].chartId + ',' + this.chartId
                req('updateRotationChartState', {
                  chartId: this.chartId,
                  chartState: 1
                }).then(data => {
                  if (data.code === 0) {
                    this.$message.success('禁用成功')
                    this.search()
                  } else {
                    this.$message.error('禁用失败')
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
      columnList: [
        { label: '排序', prop: 'sort' },
        { label: '图片路径', prop: 'chartImage' },
        { label: '状态', prop: 'chartState', distName: 'chartStateOptions' },
        { label: '预览', prop: 'watch' },
        { label: '有效期起', prop: 'termValidityBegin' },
        { label: '有效期止', prop: 'termValidityEnd' }
      ],
      tableData: [],
      formRules: {
        sort: [
          { required: true, message: '请输入排序', trigger: ['blur', 'change'] },
          { type: 'number', message: '排序必须为数字值' }
        ],
        termValidityBegin: [
          { required: true, message: '请输入起始有效期', trigger: ['blur', 'change'] }
        ],
        termValidityEnd: [
          { required: true, message: '请输入截止有效期', trigger: ['blur', 'change'] }
        ],
        goodsCode: [
          { required: true, message: '请选择商品', trigger: ['blur', 'change'] }
        ],
        chartImage: [
          { required: true, message: '请添加图片' }
        ]
      }
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.fetch()
  },
  filters: {
    // 图片预览
    filterDist (value, distName) {
      if (distName) {
        return this[distName].filter(item => {
          return item.value === value
        })[0].label
      }
    }
  },
  methods: {
    // 预览图片
    watchImg (data) {
      // 图片路径
      window.open(data.chartImage)
    },
    // 让每次搜索都从第一页开始
    fetch () {
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      // 服务器请求数据，getTaleData详情请看usermanage.js
      req('listRotationChartState', {
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
      this.pageInfo.pageSize = value
      this.search()
    },
    // 当前页数
    handleCurrentChange (value) {
      this.pageInfo.pageNum = value
      this.search()
    },
    // 选择框
    handleSelectionChange (rows) {
      // 选中选择框
      this.getUserCode = rows
    },
    dialogBeforeClose () {
      console.log('你老妈')
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addRotationChart') {
            this.dateFormat()
            req('addRotationChart', {
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
    // 图片预览，转换字典
    filterDist (value, item) {
      if (item.distName) {
        return this[item.distName].filter(distItem => {
          return distItem.value === value
        })[0].label
      } else {
        return value
      }
    },
    // 表格表头的循环list变量名一定要是一致的(columnList)
    // 商品状态数字和文字互转
    columnFormatter (row, column, cellValue, index) {
      const distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        // console.log(row)
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    },
    // 日期格式化
    dateFormat () {
      this.dialogForData.termValidityBegin = moment(this.dialogForData.termValidityBegin).format('YYYY-MM-DD')
      this.dialogForData.termValidityEnd = moment(this.dialogForData.termValidityEnd).format('YYYY-MM-DD')
    }
  }
}
</script>
