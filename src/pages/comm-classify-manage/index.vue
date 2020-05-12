<template>
    <div class="containers">
        <el-container>
            <el-header>
                <div class="btn">
                    <el-button type="primary" @click="addClick">新增</el-button>
                    <el-button type="primary" @click="updateClick">修改</el-button>
                    <el-button type="primary" @click="Delete">删除</el-button>
                    <el-button type="primary" @click="search">刷新</el-button>
                </div>
                <el-dialog
                v-model="dialogVisible"
                width="25%"
                title="新增分类"
                :visible.sync="innerVisible"
                        height="200px"
                @dialog-before-close="dialogBeforeClose">
                <div>
                    <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="80px">
                        <el-form-item label="分类名称" prop="sortName">
                            <el-input v-model="dialogFormData.sortName"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="sortRemark">
                            <el-input v-model="dialogFormData.sortRemark"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogCancel">取 消</el-button>
                    <el-button type="primary" @click="dialogConfirm">确 定</el-button>
                </span>
                </el-dialog>
                <div class="menuDetails"><span>分类详情</span></div>
            </el-header>
            <el-container>
                <el-aside width="303px">
                    <div class="elMenu">
                        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </div>

                </el-aside>
                <el-main>
                    <el-form :inline="true" label-width="100px">
                        <el-col :span="12">
                            <el-form-item label="分类名称" prop="sortName">
                                <el-input v-model="formData.sortName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注" prop="sortRemark">
                                <el-input v-model="formData.sortRemark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>
<script>
// import ISearch from '@/components/common/i-search.vue'
// import ITable from '@/components/common/i-table.vue'
// import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/comm-classify-manage.js'
export default {
  name: 'menu-manage',
  data () {
    return {
      data: [],
      getData: '',
      getCode: '',
      getClickCommClassifyCode: '',
      formData: {
        sortName: '',
        sortRemark: '',
        sortId: '',
        parentCode: '',
        version: ''
      },
      dialogVisible: false,
      innerVisible: false,
      dialogFormData: {
        sortName: '',
        sortRemark: '',
        version: '',
        parentCode: 0
      },
      formRules: {
        sortName: [{ required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }]
      },
      treeData: [],
      defaultProps: {
        label: 'SortName',
        children: 'secondSortList'
      }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      // 服务器请求数据，getTaleData详情请看usermanage.js
      req('listGoodsSort', {
      }).then(data => {
        // 获取服务器响应数据
        this.treeData = this.initData(data.data)
        // 把父级编码清空，方可新增一级分类
        this.getData = 0
      })
    },
    // 将一二级分类名称转化为SortName
    initData (data) {
      const treeData = JSON.parse(JSON.stringify(data).replace(/firstSortName|secondSortName/g, 'SortName'))
      return treeData
    },
    // 获取分类详情
    handleNodeClick (data) {
      // 获取选中分类数组
      this.getClickCommClassifyCode = data
      if (this.getClickCommClassifyCode.firstSortId !== undefined) {
        req('getGoodsSort', {
          sortId: this.getClickCommClassifyCode.firstSortId
        }).then(data => {
          this.formData = Object.assign({}, data.data)
          this.getData = data.data.sortId
          this.getCode = data.data.sortId
        })
      } else {
        req('getGoodsSort', {
          sortId: this.getClickCommClassifyCode.secondSortId
        }).then(data => {
          this.formData = Object.assign({}, data.data)
          this.getData = data.data.parentCode
          this.getCode = data.data.sortId
        })
      }
    },
    // 新增按钮
    addClick () {
      this.innerVisible = true
      this.dialogFormData.parentCode = this.getData
    },
    updateClick () {
      req('updateGoodsSort', {
        ...this.formData
      }).then(data => {
        if (data.code === 0) {
          this.$message.success(data.msg)
          this.search()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    dialogBeforeClose () {
      this.dialogVisible = false
      this.innerVisible = false
    },
    dialogCancel () {
      // this.$emit('dialog-cancels')
      this.innerVisible = false
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          req('addGoodsSort', {
            ...this.dialogFormData
          }).then(data => {
            if (data.code === 0) {
              this.dialogVisible = false
              this.$message.success(data.msg)
              this.search()
              this.innerVisible = false
              // 提交成功后清楚数据以及图片
              this.$refs.form.resetFields()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    Delete (data) {
      if (this.getCode === '') {
        this.$message.error('请先选择分类')
      } else {
        this.$confirm('此操作将永久删除该分类,是否继续?').then(() => {
          req('deleteGoodsSort', {
            sortId: this.getCode
          }).then(data => {
            // 返回0删除成功
            if (data.code === 0) {
              this.search()
              this.$message.success(data.msg)
              // 清空表单
              this.formData = {}
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.containers {
  .el-container {
    .el-header {
      .btn {
        .el-button {
          padding: 0 15px;
          border-radius: 0;
          height: 30px;
          line-height: 30px;
          text-align: center;
        }
      }
    }
  }
}

.el-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid #ddd;
    padding: 0;
    .btn {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 300px;
        height: 60px;
        border: 1px solid #ddd;
    }
    .menuDetails {
        height: 60px;
        flex: 1;
        span {
            text-align: center;
            line-height: 60px;
            font-size: 18px;
            padding:10px 30px;
            box-sizing: border-box;
        }
    }
}
.el-container {
    .el-aside {
        border: 1px solid #ddd;
    }
    .el-main {
        border: 1px solid #ddd;
    }
}
.elMenu {
    height: 400px;
    .el-menu {
      .el-menu-item {
          line-height: 30px;
          height: 30px;
          text-align: center;
          font-size: 13px;
      }
    }
}

</style>
