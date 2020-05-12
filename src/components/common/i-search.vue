<template>
  <div class="i-search">
    <el-form ref="form" :inline="true" :model="model">
      <slot></slot>

      <el-form-item>
        <el-button @click="search" type="primary">查询</el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'i-search',
  props: {
    model: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    search () {
      this.$emit('search')
    },
    reset () {
      this.$emit('reset')
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.i-search {
  padding: 10px;

  .el-form {
    /deep/ .el-form-item {
      margin-bottom: 0px;

      .el-form-item__label {
        width: 90px;
      }

      .el-form-item__content {
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

</style>
