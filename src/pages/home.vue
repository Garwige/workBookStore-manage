<template>
  <div>
    <el-container>
      <el-header>
        <div>
          <router-link to="/">行走书店管理系统</router-link>
        </div>
        <div class="user-info">
          <!-- <img src="../assets/u18.jpg" alt="">
          <span>admin</span> -->
          <el-popover
            placement="top"
            v-model="visible">
            <el-button size="mini" type="text" @click="signOut">退出登录</el-button>
            <div slot="reference">
              <!-- 判断是否有图片 -->
              <img v-show="role.imagePath" :src="role.imagePath" alt="">
              <img v-show="!role.imagePath" src= "../assets/u18.jpg" alt="">
              <span>{{role.userName}}</span>
            </div>
          </el-popover>
        </div>
      </el-header>
    <el-container>
      <el-aside>
        <el-menu @select="handlerSelect">
          <el-menu-item v-for="(item, index) in menuList" :index="item.menuRoute" :key="index">
            <span slot="title">{{item.menuName}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<style lang="scss" scoped>
  .el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(242,242,242);

  .router-link-active {
    font-size: 25px;
    color: rgb(86, 163, 254);
    text-decoration: none;
  }

  .user-info {
    height: 100%;
    display: flex;
    align-items: center;
    .el-popover__reference {
      display: flex;
    align-items: center;
    }
    span {
      color: rgb(86, 163, 254);
    }

    img {
      margin-right: 20px;
      border-radius: 50%;
      width: 50px;
      height: 50px;

    }
  }
}

.el-container {
  .el-container {
    .el-aside {
      width: 200px!important;
    }
  }
}



.el-main {
  padding: 0;
}
</style>

<script>
import req from '@/api/menu-manage.js'
export default {
  name: 'home',
  data () {
    return {
      visible: false,
      menuList: [
        // { title: '用户管理', path: 'user-manage' },
        // { title: '菜单管理', path: 'menu-manage' },
        // { title: '商品管理', path: 'comm-manage' },
        // { title: '首页轮播图管理', path: 'home-pic-manage' },
        // { title: '商品分类管理', path: 'comm-classify-manage' },
        // { title: '客户管理', path: 'client-manage' },
        // { title: '订单管理', path: 'order-manage' },
        // { title: '热门位商品管理', path: 'hot-comm-manage' },
        // { title: '门店信息管理', path: 'shop-info-manage' },
        // { title: '司机信息管理', path: 'driver-info-manage' }
      ]
    }
  },
  computed: {
    // 引入roleInfo
    role () {
      return JSON.parse(sessionStorage.getItem('roleInfo'))
    }
  },
  mounted () {
    this.listMenuHome()
  },
  methods: {
    handlerSelect (key, path) {
      if (key !== this.$route.path) {
        this.$router.push({ path: key })
      }
    },
    listMenuHome () {
      req('listMenuHome', {
      }).then(data => {
        this.menuList = data.data
      })
    },
    // 清除sessionStorage数据
    signOut () {
      // sessionStorage.clear('userInfo')
      // sessionStorage.clear('roleInfo')
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
