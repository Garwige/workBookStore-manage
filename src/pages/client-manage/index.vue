<template>
  <div>
     <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
         <el-form-item label="客户名称" prop="userName">
           <el-input v-model="formData.userName"></el-input>
         </el-form-item>
         <el-form-item label="客户账号" prop="userAccount">
           <el-input v-model="formData.userAccount"></el-input>
         </el-form-item>
       </i-search>
       <i-table
        :tableData="tableData"
        :pageInfo="pageInfo"
        :selectionShow="false"
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
         >
         </el-table-column>
       </i-table>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import req from '@/api/client-manage.js'

export default {
  name: 'client-manage',
  components: {
    ISearch,
    ITable
  },
  data () {
    return {
      formData: {
        userName: '',
        userAccount: ''
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      columnList: [
        { label: '客户账号', prop: 'userAccount' },
        { label: '姓名', prop: 'userName' },
        { label: '性别', prop: 'sex' },
        { label: '手机', prop: 'phone' },
        { label: '客户邮箱', prop: 'email' },
        { label: '身份证', prop: 'idCard' }
      ],
      tableData: []
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
      req('listCustomer', {
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
        data.data.list.forEach(item => {
          if (item.sex === 0) {
            item.sex = '女'
          } else {
            item.sex = '男'
          }
        })
      })
    },
    reset () {
      this.fetch()
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
    },
    dialogBeforeClose () {
      console.log('你老妈')
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('表单校验通过')
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
    // 性别数字和文字互转
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
