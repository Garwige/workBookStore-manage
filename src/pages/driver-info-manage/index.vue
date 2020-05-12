<template>
  <div>
     <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
         <el-form-item label="司机编号" prop="driverCode">
           <el-input v-model="formData.driverCode"></el-input>
         </el-form-item>
         <el-form-item label="司机姓名" prop="driverName">
           <el-input v-model="formData.driverName"></el-input>
         </el-form-item>
         <el-form-item label="所在省份" prop="provinceId">
           <el-select v-model="formData.provinceId" @change="citylistArea(formData.provinceId)">
             <el-option
             v-for="(item, index) in provinceOptions"
             :key="index"
             :label="item.areaName"
             :value="item.areaId"></el-option>
           </el-select>
         </el-form-item>
         <br>
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
       <el-form label-width="100px" :model="dialogForData" ref="form" :rules="formRules" :disabled="disable">
         <el-row>
           <el-col :span="12">
             <el-form-item label="司机姓名" prop="driverName">
               <el-input v-model="dialogForData.driverName"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="联系电话" prop="phone">
               <el-input v-model.number="dialogForData.phone"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="司机账号" prop="driverAccount">
               <el-input v-model="dialogForData.driverAccount"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="密码" prop="password">
               <el-input type="password" v-model="dialogForData.password"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="身份证号" prop="idCard">
               <el-input v-model="dialogForData.idCard"></el-input>
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
           <el-col :span="12">
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
             <el-form-item label="头像" prop="imagePath">
               <i-file
               v-model="dialogForData.imagePath"></i-file>
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
import IFile from '@/components/common/i-file.vue'
import req from '@/api/driver-info-manage.js'

export default {
  name: 'driver-info-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile
  },
  data () {
    return {
      // 禁用表单，只能看不能改
      disable: false,
      // 得到多选框选中行
      getUserCode: '',
      // 详情页面表单禁用
      disable: false,
      cityAreaId: '',
      areaAreaId: '',
      formData: {
        driverCode: '',
        driverName: '',
        provinceId: '',
        cityId: '',
        areaId: ''
      },
      dialogForData: {
        driverName: '',
        phone: '',
        imagePath: '',
        driverAccount: '',
        password: '',
        idCard: '',
        provinceId: '',
        cityId: '',
        areaId: ''
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
              this.dialogTitle = '查看司机详情'
              this.dialogType = 'Deatil'
              this.disable = true
              this.driverCode = this.getUserCode[0].driverCode
              this.getDriver()
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
            this.dialogTitle = '新增司机'
            this.dialogType = 'addDriver'
            this.disable = false
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getUserCode.length === 0) {
              this.$message.error('请至少勾选一个司机')
            } else if (this.getUserCode.length === 1) {
              this.dialogVisible = true
              this.dialogTitle = '修改司机'
              this.dialogType = 'updateDriver'
              this.driverCode = this.getUserCode[0].driverCode
              this.getDriver()
              this.disable = false
            } else {
              // 错误提示信息
              this.$message.error('至多勾选一个司机')
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
              this.$message.error('请勾选至少一个司机')
            } else if (this.getUserCode.length === 1) {
              // 删一个
              // then回调函数，点确认才会触发
              this.$confirm('此操作将永久删除该司机，是否继续？').then(() => {
                req('deleteStore', {
                  // 将goodsCode发送后端 getUserCode等于rows,这是个数组
                  driverCode: this.getUserCode[0].driverCode
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
                this.driverCode = this.getUserCode[i].driverCode + ',' + this.driverCode
                this.$confirm('此操作将永久删除该司机，是否继续？').then(() => {
                  req('deleteStore', {
                    // 将userCode发送后端 getUserCode等于rows,这是个数组
                    driverCode: this.driverCode
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
      provinceOptions: [],
      cityOptions: [],
      areaOptions: [],
      dialogProvinceOptions: [],
      dialogCityOptions: [],
      dialogAreaOptions: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      columnList: [
        { label: '司机编号', prop: 'driverCode' },
        { label: '姓名', prop: 'driverName' },
        { label: '手机', prop: 'phone' },
        { label: '身份证', prop: 'idCard' },
        { label: '账号', prop: 'driverAccount' }
      ],
      tableData: [],
      formRules: {
        driverName: [
          { required: true, message: '请输入司机姓名', trigger: ['blur', 'change'] }
        ],
        driverAccount: [
          { required: true, message: '请输入司机账号', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: ['blur', 'change'] },
          {validator: this.validPhone, trigger: 'change'},
          { type: 'number', message: '手机号必须为数字值' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
        ],
        idCard: [
          { required: true, message: '请输入身份号', trigger: ['blur', 'change'] },
          { validator: this.validateIdCard, trigger: 'change' }
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
        imagePath: [
          { required: true, message: '请添加头像' }
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
    // 验证手机号
    validPhone (rule, value, callback) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/

      if (!reg.test(value)) {
        callback(new Error('请输入11位的手机号'))
      } else {
        callback()
      }
    },
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
                  this.dialogTitle = '查看司机详情'
                  this.dialogType = 'Deatil'
                  this.disable = true
                  this.driverCode = this.getUserCode[0].driverCode
                  this.getDriver()
                } else {
                  // 错误提示信息
                  this.$message.error('至多勾选一个门店')
                }
            }
          }
        ]
      }
    },
    // 校验身份证
    validateIdCard (rule, value, callback) {
      const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

      if (!reg.test(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
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
      req('listDriver', {
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
    // 重置
    reset () {

    },
    getDriver () {
      // 服务器请求的数据
      req('getDriver', {
        driverCode: this.driverCode
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
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.dialogType === 'addDriver') {
              req('addDriver', {
                ...this.dialogForData
              }).then(data => {
                if (data.code === 0) {
                  this.dialogVisible = false
                  this.$message.success(data.msg)
                  this.fetch()
                  // 提交成功后清除数据和图片
                  this.$refs.form.resetFields()
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else if (this.dialogType === 'updateDriver') {
              req('updateDriver', {
                ...this.dialogForData,
                driverCode: this.driverCode
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
      })
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    }
  }
}
</script>
