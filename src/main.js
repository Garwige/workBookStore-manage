import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  if (userInfo && userInfo.access_token) {
    next()
  } else {
    next('/login')
  }
})
