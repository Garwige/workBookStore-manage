<template>
  <div>
     <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
         <el-form-item label="门店编号" prop="storeId">
           <el-input v-model="formData.storeId"></el-input>
         </el-form-item>
         <el-form-item label="门店名称" prop="storeName">
           <el-input v-model="formData.storeName"></el-input>
         </el-form-item>
         <el-form-item label="店长名称" prop="userName">
           <el-input v-model="formData.userName"></el-input>
         </el-form-item>
         <br>
         <el-form-item label="所在省份" prop="provinceId">
           <el-select v-model="formData.provinceId" @change="citylistArea(formData.provinceId)">
             <el-option
             v-for="(item, index) in provinceOptions"
             :key="index"
             :label="item.areaName"
             :value="item.areaId"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="所在城市" prop="cityId">
           <el-select v-model="formData.cityId" @change="arealistArea(formData.cityId)">
             <el-option
             v-for="(item, index) in cityOptions"
             :key="index"
             :label="item.areaName"
             :value="item.areaId"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="所在区" prop="areaId">
           <el-select v-model="formData.areaId">
             <el-option
             v-for="(item, index) in areaOptions"
             :key="index"
             :label="item.areaName"
             :value="item.areaId"></el-option>
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
         :width="item.width"
         align="center"
         >
         </el-table-column>
       </i-table>

       <i-dialog
       v-model="dialogVisible"
       :title="dialogTitle"
       @dialog-before-close="dialogBeforeClose"
       @dialog-confirm="dialogConfirm"
       @dialog-cancel="dialogCancel">
       <el-form label-width="110px" :model="dialogForData" ref="form" :rules="formRules" :disabled="disable">
         <el-row>
           <el-col :span="12">
             <el-form-item label="门店名称" prop="storeName">
               <el-input v-model="dialogForData.storeName"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="联系电话" prop="telephone">
               <el-input v-model.number="dialogForData.telephone"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="店长编号" prop="userCode">
               <el-input v-model="dialogForData.userCode"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="营业执照编码" prop="businessLicense">
               <el-input v-model="dialogForData.businessLicense"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="所在省份" prop="provinceId">
               <el-select v-model="dialogForData.provinceId" placeholder="请选择" @change="dialogCitylistArea(dialogForData.provinceId)">
                <el-option
                  v-for="(item, index) in dialogProvinceOptions"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaId"></el-option>
              </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="所在城市" prop="cityId">
               <el-select v-model="dialogForData.cityId" placeholder="请选择" @change="dialogArealistArea(dialogForData.cityId)">
                <el-option
                  v-for="(item, index) in dialogCityOptions"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaId"></el-option>
              </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="24">
             <el-form-item label="所在区" prop="areaId">
               <el-select v-model="dialogForData.areaId" placeholder="请选择">
                <el-option
                  v-for="(item, index) in dialogAreaOptions"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaId"></el-option>
              </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="详细地址" prop="address">
              <el-input type="textarea" v-model="dialogForData.address"></el-input>
            </el-form-item>
           </el-col>
         </el-row>
       </el-form>
       </i-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .el-form {
    .el-row {
      .el-form-item {
      .el-form-item__content {
        .el-select {
          width: 200px;
        }
      }
    }
      .el-col {
        .el-form-item {
          .el-input {
            width: 200px;
          }
        }
      }
    }
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
import req from '@/api/shop-info-manage.js'

export default {
  name: 'shop-info-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      // 得到多选框选中行
      getUserCode: '',
      disable: false,
      cityAreaId: '',
      areaAreaId: '',
      formData: {
        storeId: '',
        storeName: '',
        userName: '',
        provinceId: '',
        cityId: '',
        areaId: ''
      },
      dialogForData: {
        storeName: '',
        telephone: '',
        userCode: '',
        businessLicense: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        address: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            if (this.getUserCode.length === 0) {
              this.$message.error('请至少勾选一个门店')
            } else if (this.getUserCode.length === 1) {
              this.dialogVisible = true
              this.dialogTitle = '查看门店详情'
              this.dialogType = 'Deatil'
              this.disable = true
              this.storeId = this.getUserCode[0].storeId
              this.getStore()
            } else {
              // 错误提示信息
              this.$message.error('至多勾选一个门店')
            }
          }
        },
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增门店'
            this.dialogType = 'addStore'
            this.disable = false
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getUserCode.length === 0) {
              this.$message.error('请至少勾选一个门店')
            } else if (this.getUserCode.length === 1) {
              this.dialogVisible = true
              this.dialogTitle = '修改门店'
              this.dialogType = 'updateStore'
              this.storeId = this.getUserCode[0].storeId
              this.getStore()
              this.disable = false
            } else {
              // 错误提示信息
              this.$message.error('至多勾选一个门店')
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
              this.$message.error('请勾选至少一个门店')
            } else if (this.getUserCode.length === 1) {
              // 删一个
              // then回调函数，点确认才会触发
              this.$confirm('此操作将永久删除该门店，是否继续？').then(() => {
                req('deleteStore', {
                  // 将goodsCode发送后端 getUserCode等于rows,这是个数组
                  storeId: this.getUserCode[0].storeId
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
                this.storeId = this.getUserCode[i].storeId + ',' + this.storeId
                this.$confirm('此操作将永久删除该门店，是否继续？').then(() => {
                  req('deleteStore', {
                    // 将userCode发送后端 getUserCode等于rows,这是个数组
                    storeId: this.storeId
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
        }
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      provinceOptions: [],
      cityOptions: [],
      areaOptions: [],
      dialogProvinceOptions: [],
      dialogCityOptions: [],
      dialogAreaOptions: [],
      columnList: [
        { label: '门店编号', prop: 'storeId', width: 200},
        { label: '门店名称', prop: 'storeName' },
        { label: '电话', prop: 'telephone' },
        { label: '详细地址', prop: 'address' },
        { label: '店长姓名', prop: 'userName' },
        { label: '邀请码', prop: 'inviteCode' },
        { label: '门店账号', prop: 'userAccount' }
      ],
      tableData: [],
      formRules: {
        storeName: [
          { required: true, message: '请输入门店名称', trigger: ['blur', 'change'] }
        ],
        telephone: [
          { required: true, message: '请输入联系电话', trigger: ['blur', 'change'] },
          { type: 'number', message: '手机号必须为数字值' }
        ],
        userCode: [
          { required: true, message: '请输入店长编号', trigger: ['blur', 'change'] }
        ],
        businessLicense: [
          { required: true, message: '营业执照编码', trigger: ['blur', 'change'] }
        ],
        provinceId: [
          { required: true, message: '请选择省份', trigger: ['blur', 'change'] }
        ],
        cityId: [
          { required: true, message: '请选择城市', trigger: ['blur', 'change'] }
        ],
        areaId: [
          { required: true, message: '请选择所在区', trigger: ['blur', 'change'] }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.fetch()
    this.buttonShow()
  },
  methods: {
    // 根据角色显示按钮
    buttonShow () {
      if (JSON.parse(sessionStorage.getItem('roleInfo')).role === 1) {
        this.toolbar = [
            {
            btnName: '详情',
            type: 'primary',
            func: () => {
              if (this.getUserCode.length === 0) {
                this.$message.error('请至少勾选一个门店')
              } else if (this.getUserCode.length === 1) {
                this.dialogVisible = true
                this.dialogTitle = '查看门店详情'
                this.dialogType = 'Deatil'
                this.disable = true
                this.storeId = this.getUserCode[0].storeId
                this.getStore()
              } else {
                // 错误提示信息
                this.$message.error('至多勾选一个门店')
              }
            }
          },
          {
            btnName: '修改',
            type: 'primary',
            func: () => {
              if (this.getUserCode.length === 0) {
                this.$message.error('请至少勾选一个门店')
              } else if (this.getUserCode.length === 1) {
                this.dialogVisible = true
                this.dialogTitle = '修改门店'
                this.dialogType = 'updateStore'
                this.storeId = this.getUserCode[0].storeId
                this.getStore()
                this.disable = false
              } else {
                // 错误提示信息
                this.$message.error('至多勾选一个门店')
              }
            }
          }
        ]
      }
    },
    // 让每次搜索都从第一页开始
    fetch () {
      this.pageInfo.pageNum = 1
      this.search()
      this.provincelistArea()
      this.dialogProvincelistArea()
    },
    search () {
      // 服务器请求数据，getTaleData详情请看usermanage.js
      req('listStore', {
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
    getStore () {
      // 服务器请求的数据
      req('getStore', {
        storeId: this.storeId
      }).then(data => {
        Promise.all([
          // 因为市和区查询详情的时候是为空所以要重新传省和市过去获取
          this.dialogCitylistArea(data.data.provinceId),
          this.dialogArealistArea(data.data.cityId)
        ]).then(dataList => {
          // 在dialog添上服务器传来的数据
          this.dialogForData = Object.assign({}, data.data)
          console.log('dataList', dataList)
          console.log('data', data)
        })
      })
    },
    // 查省级选择框
    provincelistArea () {
      req('listArea', {
        areaId: 0
      }).then(data => {
        this.provinceOptions = data.data
        console.log('你老妹个省')
      })
    },
    // 查市级选择框
    citylistArea (value) {
      return new Promise((resolve, reject) => {
        this.cityAreaId = value
        req('listArea', {
          areaId: this.cityAreaId
        }).then(data => {
          this.cityOptions = []
          this.formData.cityId = ''
          this.cityOptions = data.data
          resolve(data)
          console.log('你老妹个市')
        })
      })
    },
    // 查区级选择框
    arealistArea (value) {
      return new Promise((resolve, reject) => {
        this.areaAreaId = value
        req('listArea', {
          areaId: this.areaAreaId
        }).then(data => {
          this.areaOptions = []
          this.formData.areaId = ''
          this.areaOptions = data.data
          resolve(data)
          console.log('你老妹个区')
        })
      })
    },
    // 弹出框
    // 查省级选择框
    dialogProvincelistArea () {
      req('listArea', {
        areaId: 0
      }).then(data => {
        this.dialogProvinceOptions = data.data
      })
    },
    // 查市级选择框
    dialogCitylistArea (value) {
      return new Promise((resolve, reject) => {
        this.cityAreaId = value
        req('listArea', {
          areaId: this.cityAreaId
        }).then(data => {
          this.dialogCityOptions = []
          this.dialogForData.cityId = ''
          this.dialogCityOptions = data.data
          resolve(data)
        })
      })
    },
    // 查区级选择框
    dialogArealistArea (value) {
      return new Promise((resolve, reject) => {
        this.areaAreaId = value
        req('listArea', {
          areaId: this.areaAreaId
        }).then(data => {
          this.dialogAreaOptions = []
          this.dialogForData.areaId = ''
          this.dialogAreaOptions = data.data
          resolve(data)
        })
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
      this.getUserCode = rows
    },
    dialogBeforeClose () {
      console.log('你老妈')
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addStore') {
            req('addStore', {
              ...this.dialogForData
            }).then(data => {
              if (data.code === 0) {
                this.dialogVisible = false
                this.$message.success(data.msg)
                this.fetch()
                // 提交成功后清楚数据
                this.$refs.form.resetFields()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'updateStore') {
            req('updateStore', {
              ...this.dialogForData,
              storeId: this.storeId
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
          } else if (this.dialogType === 'Deatil') {
            this.dialogVisible = false
          }
        } else {
          return false
        }
      })
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    }
  }
}
</script>
