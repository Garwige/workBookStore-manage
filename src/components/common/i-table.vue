<template>
  <div class="i-table">
    <div class="btn-list" v-show="toolbar.length">
      <el-button
      v-for="(item, index) in toolbar"
      :key="index"
      @click="item.func"
      :type="item.type">
      {{item.btnName}}
      </el-button>
    </div>

    <div>
      <!-- 设置height固定表头，fixed固定右边列 -->
      <el-table border :data="tableData" @selection-change="handleSelectionChange" fixed="right">
        <el-table-column
          v-if="selectionShow"
          type="selection"
          width="54"
          align="center">
        </el-table-column>
        <slot></slot>
      </el-table>
    </div>

    <div class="table-pagination">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.pageNum"
      :page-sizes="[5, 10, 20, 50, 100]"
      :page-size="pageInfo.pageSize"
      v-show="tableData.length"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'i-table',
  props: {
    toolbar: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageInfo: {
      type: Object,
      default: () => {
        return {
          pageNum: 1,
          pageSize: 5,
          total: 0
        }
      }
    },
    selectionShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 每页条数
    handleSizeChange (value) {
      this.$emit('handleSizeChange', value)
    },
    // 当前页数
    handleCurrentChange (value) {
      this.$emit('handleCurrentChange', value)
    },
    // 多选框改变
    handleSelectionChange (rows) {
      console.log(rows)
      this.$emit('selection-change', rows)
    }
  },
  data () {
    return {
      currentPage: 1
    }
  }
}
</script>

<style lang="scss" scoped>
.i-table {
  padding: 10px;
  .btn-list {
    margin-bottom: 10px;
    margin-left: 10px;
    .el-button {
      padding: 0 15px;
      border-radius: 0;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
  }
  .table-pagination {
    .el-pagination {
      text-align: right;
      width: 95%;
    }
  }
}
.el-table {
  width: 1100px;
}
</style>
