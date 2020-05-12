import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/pages/error/error.vue')
  },
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/pages/login/login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/user-manage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ '@/pages/home.vue'),
    children: [
      {
        path: '/user-manage',
        name: 'user-manage',
        component: () => import(/* webpackChunkName: "user-manage" */ '@/pages/user-manage/index.vue')
      },
      {
        path: '/menu-manage',
        name: 'menu-manage',
        component: () => import(/* webpackChunkName: "menu-manage" */ '@/pages/menu-manage/index.vue')
      },
      {
        path: '/comm-manage',
        name: 'comm-manage',
        component: () => import(/* webpackChunkName: "comm-manage" */ '@/pages/comm-manage/index.vue')
      },
      {
        path: '/home-pic-manage',
        name: 'home-pic-manage',
        component: () => import(/* webpackChunkName: "home-pic-manage" */ '@/pages/home-pic-manage/index.vue')
      },
      {
        path: '/comm-classify-manage',
        name: 'comm-classify-manage',
        component: () => import(/* webpackChunkName: "user-manage" */ '@/pages/comm-classify-manage/index.vue')
      },
      {
        path: '/client-manage',
        name: 'client-manage',
        component: () => import(/* webpackChunkName: "client-manage" */ '@/pages/client-manage/index.vue')
      },
      {
        path: '/order-manage',
        name: 'order-manage',
        component: () => import(/* webpackChunkName: "order-manage" */ '@/pages/order-manage/index.vue')
      },
      {
        path: '/hot-comm-manage',
        name: 'hot-comm-manage',
        component: () => import(/* webpackChunkName: "user-manage" */ '@/pages/hot-comm-manage/index.vue')
      },
      {
        path: '/shop-info-manage',
        name: 'shop-info-manage',
        component: () => import(/* webpackChunkName: "user-manage" */ '@/pages/shop-info-manage/index.vue')
      },
      {
        path: '/driver-info-manage',
        name: 'driver-info-manage',
        component: () => import(/* webpackChunkName: "driver-info-manage" */ '@/pages/driver-info-manage/index.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
