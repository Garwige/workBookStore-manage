<template>
  <div>
     <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
         <el-form-item label="用户名" prop="userName">
           <el-input v-model="formData.userName"></el-input>
         </el-form-item>
         <el-form-item label="用户账户" prop="userAccount">
           <el-input v-model="formData.userAccount"></el-input>
         </el-form-item>
         <el-form-item label="角色" prop="role">
           <el-select v-model="formData.role">
             <el-option
             v-for="(item, index) in roleOption"
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
         :width="item.width"
         align="center"
         :formatter="columnFormatter"
         >
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
             <el-form-item label="用户账号" prop="userAccount">
               <el-input v-model="dialogForData.userAccount"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="用户姓名" prop="userName">
               <el-input v-model="dialogForData.userName"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="用户性别" prop="sex">
               <el-select v-model="dialogForData.sex">
                 <el-option
                 v-for="(item, index) in sexOption"
                 :key="index"
                 :label="item.label"
                 :value="item.value"></el-option>
               </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="手机号" prop="phone">
               <el-input v-model.number="dialogForData.phone"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="用户邮箱" prop="email">
               <el-input v-model="dialogForData.email"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="身份证" prop="idCard">
               <el-input v-model="dialogForData.idCard"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="用户密码" prop="password">
               <el-input type="password" v-model="dialogForData.password"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="用户角色" prop="role">
              <el-select v-model="dialogForData.role" placeholder="请选择">
              <el-option
              v-for="(item, index) in dialogOption"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
            </el-select>
            </el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="用户头像" prop="imagePath">
              <!-- name是接口请求参数的字段名 -->
              <i-file
              v-model="dialogForData.imagePath"></i-file>
              <!-- <el-upload
                ref="upload"
                class="upload-demo"
                action="http://20q024h9635.qicp.vip/pc/imageUpload/uploadImage"
                :on-success="handleAvatarSuccess"
                :limit="1"
                :data="photoToken"
                name="file"
                :on-exceed="handleExceed"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload> -->
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
import IFile from '@/components/common/i-file.vue'
import req from '@/api/user-manage.js'

export default {
  name: 'user-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile
  },
  data () {
    return {
      // 图片
      imageUrl: '',
      // 删除功能选中项
      getUserCode: [],
      userCode: [],
      photoToken: { access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token },
      dialogType: '',
      formData: {
        userName: '',
        userAccount: '',
        role: ''
      },
      // 查询列表用户角色选择框
      roleOption: [
        { label: '管理员', value: '0' },
        { label: '店长', value: '1' }
      ],
      // 新增列表用户角色选择框
      dialogOption: [
        { label: '管理员', value: '0' },
        { label: '店长', value: '1' }
      ],
      // 性别选择框
      sexOption: [
        { label: '男', value: 1 },
        { label: '女', value: 0 }
      ],
      dialogForData: {
        userAccount: '',
        userName: '',
        sex: '',
        phone: '',
        email: '',
        idCard: '',
        password: '',
        role: '',
        imagePath: '',
        version: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增用户'
            this.dialogType = 'addUser'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getUserCode.length === 0) {
              this.$message.error('请至少勾选一个用户')
            } else if (this.getUserCode.length === 1) {
              this.dialogTitle = '修改用户'
              this.dialogVisible = true
              this.dialogType = 'updateUser'
              this.userCode = this.getUserCode[0].userCode
              this.getUser()
            } else {
              // 错误提示信息
              this.$message.error('至多勾选一个用户')
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
              this.$message.error('请勾选至少一个用户')
            } else if (this.getUserCode.length === 1) {
              // 删一个
              // then回调函数，点确认才会触发
              this.$confirm('此操作将永久删除该用户，是否继续？').then(() => {
                req('deleteUser', {
                  // 将userCode发送后端 getUserCode等于rows,这是个数组
                  userCode: this.getUserCode[0].userCode
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
                this.userCode = this.getUserCode[i].userCode + ',' + this.userCode
                this.$confirm('此操作将永久删除该用户，是否继续？').then(() => {
                  req('deleteUser', {
                    // 将userCode发送后端 getUserCode等于rows,这是个数组
                    userCode: this.userCode
                  }).then(data => {
                    // 返回0删除成功
                    if (data.code === 0) {
                      this.search()
                      // 成功提示信息
                      this.$message.success(data.msg)
                    } else {
                      this.$message.error(data.msg)
                    }
                  })
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
        { label: '用户编码', prop: 'userCode', width: 180},
        { label: '账号', prop: 'userAccount' },
        { label: '姓名', prop: 'userName' },
        { label: '角色', prop: 'role', distName: 'roleOption' },
        { label: '性别', prop: 'sex', distName: 'sexOption' },
        { label: '手机', prop: 'phone', width: 130 },
        { label: '邮箱', prop: 'email', width: 180 },
        { label: '身份证', prop: 'idCard', width: 180 }
      ],
      tableData: [],
      formRules: {
        userAccount: [
          { required: true, message: '请输入用户账号', trigger: ['blur', 'change'] }
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: ['blur', 'change'] }
        ],
        sex: [
          { required: true, message: '请输入用户性别', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          {validator: this.validPhone, trigger: 'change'},
          { type: 'number', message: '手机号必须为数字值' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: ['blur', 'change'] },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        idCard: [
          { required: true, message: '请输入身份证号码', trigger: ['blur', 'change'] },
          { validator: this.validateIdCard, trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: ['blur', 'change'] }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: ['blur', 'change'] }
        ],
        imagePath: [
          { required: true, message: '请添加图片' }
        ]
      }
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.fetch()
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
      this.pageInfo.pageSize = 5
      this.search()
    },
    // 查询表格数据
    search () {
      // 服务器请求数据，getTaleData详情请看usermanage.js
      req('getTableData', {
        // 发送formData整个对象
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
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
    // 列表选择框
    handleSelectionChange (rows) {
      console.log('rows', rows)
      this.getUserCode = rows
    },
    // 修改用户信息时，获取用户信息显示到dialog
    getUser () {
      // 服务器请求的数据
      req('getUser', {
        userCode: this.userCode
      }).then(data => {
        // 在dialog添上服务器传来的数据
        this.dialogForData = Object.assign({}, data.data)
      })
    },
    dialogBeforeClose () {
      console.log('你老妈')
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addUser') {
            req('addUser', {
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
          } else if (this.dialogType === 'updateUser') {
            req('updateUser', {
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
    // 性别和角色的数字和文字互转
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
    }
  }
}
</script>
