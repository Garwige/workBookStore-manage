<template>
    <div class="background">
        <div class="login">
            <div class="text">请登录</div>
            <div>
                <el-form :model="formData">
                    <el-form-item prop="username">
                        <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="formData.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="btnLogin">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
            </div>

        </div>
    </div>
</template>
<script>
// import qs from 'qs'
import axios from 'axios'
const qs = require('qs')
export default {
  name: 'login',
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    btnLogin () {
    // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;'
      axios({
        method: 'post',
        url: 'http://20q024h9635.qicp.vip/uaa/auth/form',
        data: qs.stringify(this.formData),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;'
        }

      }).then(data => {
        if (data.data.code === 0) {
          this.$message({
            type: 'success',
            message: data.data.msg
          })
          sessionStorage.setItem('userInfo', JSON.stringify(data.data.data))
          this.getHeader(data.data.data.access_token)
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    },
    getHeader (token) {
      axios({
        method: 'post',
        url: 'http://20q024h9635.qicp.vip/pc/topOfColumn/getTopOfColumn',
        data: qs.stringify({ access_token: token }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;'
        }
      }).then(data => {
        if (data.data.code === 0) {
          sessionStorage.setItem('roleInfo', JSON.stringify(data.data.data))
          if (data.data.data.role === 1) {
            this.$router.push({ path: '/client-manage' })
          } else {
            this.$router.push({ path: '/home' })
          }
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .background {
        height: 800px;
        width: 100%;
        background-image: url('~@/assets/u0.jpg');
        background-repeat:no-repeat;
        background-size: 100% 80%;

        .login {
            height: 250px;
            width: 250px;
            background: rgba(255, 255, 255, 0.2);
            float: right;
            position: relative;
            // opacity:0.2;
            margin: 70px;
            .text {
                position: absolute;
                top: 10%;
                left: 50%;
                transform: translate(-50%,-50%);
                color: #ddd;
                // padding-left: 30px;
            }
            .el-form {
                margin-top: 40px;
                padding: 20px;
            }
            .el-button {
                width: 120px;
                margin-left: 65px;
            }

        }
    }
</style>
