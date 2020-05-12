<template>
  <div>
    <el-dialog
    :title="title"
    :visible.sync="Visible"
    width="50%"
    :before-close="dialogBeforeClose"
    @close="dialogClose"
    :append-to-body="appendToBody">
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogCancel">取消</el-button>
      <el-button @click="dialogConfirm" type="primary">确认</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'i-dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      Visible: false
    }
  },
  methods: {
    dialogClose () {
      this.Visible = false
      this.$emit('input', this.Visible)
    },
    dialogCancel () {
      this.$emit('dialog-cancel')
    },
    dialogConfirm () {
      this.$emit('dialog-confirm')
    },
    dialogBeforeClose () {
      this.$emit('dialog-before-close')
      this.Visible = false
    }
  },
  watch: {
    value: {
      handler (value) {
        this.Visible = value
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  .el-input__inner{
    width: 100px;
  }
}
</style>
