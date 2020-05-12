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
                width="25%"
                :title="dialogTitles"
                :visible.sync="dialogVisible"
                height="200px"
                :before-close="dialogBeforeClose">
                <div>
                    <el-form  :model="dialogFormData" ref="form" :rules="formRules" label-width="80px">
                        <el-form-item label="名称" prop="menuName">
                            <el-input v-model="dialogFormData.menuName"></el-input>
                        </el-form-item>
                        <el-form-item label="路径" prop="menuRoute">
                            <el-input v-model="dialogFormData.menuRoute"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="menuRemark">
                            <el-input v-model="dialogFormData.menuRemark"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogCancel">取 消</el-button>
                    <el-button type="primary" @click="dialogConfirm">确 定</el-button>
                </span>
                </el-dialog>
                <div class="menuDetails"><span>菜单详情</span></div>
            </el-header>
            <el-container>
                <el-aside width="303px">
                    <div class="elMenu">
                        <!-- <el-menu>
                            <el-menu-item v-for="(item,index) in menuList" :index="item.path" :key="index">
                                <span slot="title">{{item.menuName}}</span>
                            </el-menu-item>
                        </el-menu> -->
                        <el-tree :data="menuList" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </div>

                </el-aside>
                <el-main>
                    <el-form :inline="true" label-width="100px">
                        <el-col :span="12">
                            <el-form-item label="菜单名称" prop="menuName">
                                <el-input v-model="formData.menuName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="菜单路由" prop="menuRoute">
                                <el-input v-model="formData.menuRoute"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注" prop="menuRemark">
                                <el-input v-model="formData.menuRemark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>
<script>
import req from '@/api/menu-manage.js'
// import ISearch from '@/components/common/i-search.vue'
// import ITable from '@/components/common/i-table.vue'
// import IDialog from '@/components/common/i-dialog.vue'
export default {
  name: 'menu-manage',
  data () {
    return {
      getData: '',
      formData: {},
      dialogVisible: false,
      dialogTitles: '',
      version: '',
      dialogFormData: {
        menuName: '',
        menuRoute: '',
        menuRemark: ''
      },
      menuList: [],
      defaultProps: { label: 'menuName' },
      formRules: {
        menuName: [{ required: true, message: '请输入名称', trigger: ['blur', 'change'] }],
        menuRoute: [{ required: true, message: '请输入路由', trigger: ['blur', 'change'] }]
      }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    addClick () {
      this.dialogVisible = true
      this.dialogTitles = '新增菜单'
    },
    updateClick () {
      req('updateMenu', {
        version: this.version,
        ...this.formData
      }).then(data => {
        if (data.code === 0) {
          this.$message.success(data.msg)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    search () {
      // 服务器请求数据，getTaleData详情请看usermanage.js
      req('listMenu', {
      }).then(data => {
        // 获取服务器响应数据
        console.log(data)
        this.menuList = data.data
      })
    },
    dialogBeforeClose () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      // this.$emit('dialog-cancels')
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          req('addMenu', {
            ...this.dialogFormData
          }).then(data => {
            if (data.code === 0) {
              this.dialogVisible = false
              this.$message.success(data.msg)
              this.search()
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
    // 点击菜单显示数据
    handleNodeClick (data) {
      req('getMenu', {
        menuCode: data.menuCode
      }).then(data => {
        this.formData = data.data
        this.version = data.data.version
        this.getData = data.data.menuCode
      })
    },
    Delete (data) {
      if (this.getData === '') {
        this.$message.error('请先选择菜单')
      } else {
        this.$confirm('此操作将永久删除该菜单,是否继续?').then(() => {
          req('deleteMenu', {
            menuCode: this.getData
          }).then(data => {
            // 返回0删除成功
            if (data.code === 0) {
              this.search()
              this.$message.success(data.msg)
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
