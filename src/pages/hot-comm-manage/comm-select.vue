<template>
  <div class="container">
    <div class="comm-box">
      <el-button class="add-btn" @click="openDialog" type="primary" icon="el-icon-plus"></el-button>
      <span>{{goodsCode}}</span>
    </div>

    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm"
      @dialog-open="dialogOpen"
      :appendToBody="true">

      <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="formData.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="goodsCode">
          <el-input v-model="formData.goodsCode"></el-input>
        </el-form-item>
      </i-search>

      <i-table
        :tableData="tableData"
        :pageInfo="pageInfo"
        :selectionShow="true"
        v-loading="tableLoading"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @selection-change="handleSelectionChange">
        <el-table-column
          v-for="(item, index) in columnList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center"
          :width="item.width"
          :show-overflow-tooltip="true">
          <!-- :formatter="columnFormatter" -->
        </el-table-column>
      </i-table>
    </i-dialog>
  </div>
</template>

<script>
import IDialog from '@/components/common/i-dialog.vue'
import ITable from '@/components/common/i-table.vue'
import ISearch from '@/components/common/i-search.vue'
import req from '@/api/home-pic-manage.js'

export default {
  name: 'comm-sleect',
  components: {
    IDialog,
    ITable,
    ISearch
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      goodsCode: '',
      dialogVisible: false,
      dialogTitle: '轮播商品选择',
      formData: {
        goodsName: '',
        goodsCode: ''
      },
      tableData: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      goodsStateOptions: [
        { label: '售罄', value: '0' },
        { label: '在售', value: '1' },
        { label: '已下架', value: '2' },
        { label: '未发布', value: '3' }
      ],
      tableLoading: false,
      tableSelectRows: [],
      columnList: [
        { label: '商品编号', prop: 'goodsCode' },
        { label: '商品名称', prop: 'goodsName' },
        { label: '商品状态', prop: 'goodsState', distName: 'goodsStateOptions' },
        { label: '一级分类', prop: 'firstSortName' },
        { label: '二级分类', prop: 'secondSortName' }
      ]
    }
  },
  watch: {
    value: {
      handler (value) {
        this.goodsCode = value
      },
      deep: true
    }
  },
  mounted () {
    // 一进去就查询数据
    this.fetch()
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
    },
    dialogBeforeClose () {
      this.formData.goodsName = ''
      this.formData.goodsCode = ''
      this.dialogVisible = false
    },
    dialogOpen () {
      this.fetch()
    },
    dialogCancel () {
      this.formData.goodsName = ''
      this.formData.goodsCode = ''
      this.dialogVisible = false
    },
    dialogConfirm () {
      if (this.tableSelectRows.length === 0) {
        this.$message.info('请至少选择一条数据')

        return
      }

      if (this.tableSelectRows.length > 1) {
        this.$message.info('只能选择一条数据')

        return
      }

      this.$emit('input', this.tableSelectRows[0].goodsCode)
      this.formData.goodsName = ''
      this.formData.goodsCode = ''
      this.dialogVisible = false
    },
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      this.tableLoading = true

      req('listRotationGoods', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        console.log(data)
        this.tableLoading = false
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        data.data.list.forEach(item => {
          if (item.goodsState === '0') {
            item.goodsState = '在售'
          } else if (item.goodsState === '1') {
            item.goodsState = '已下架'
          } else {
            item.goodsState = '未发布'
          }
        })
      }).catch(() => {
        this.tableLoading = false
      })
    },
    reset () {
      this.fetch()
    },
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    handleCurrentChange (value) {
      this.pageInfo.pageNum = value
      this.search()
    },
    handleSelectionChange (rows) {
      this.tableSelectRows = rows
    },
    // 表格表头的循环list变量名一定要是columnList
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

<style lang="scss" scoped>
.container {
  .comm-box {
    display: flex;
    justify-content: space-between;

    .add-btn {
      padding: 0 10px;
    }

    span:nth-child(2) {
      flex: 1;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      padding: 0 5px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        color: #409EFF;
      }
    }

    .delete-btn {
      padding: 0 10px;
    }
  }
}
.i-search {
  .el-form-item {
    .el-input {
      width: 170px;
    }
  }
}
</style>
