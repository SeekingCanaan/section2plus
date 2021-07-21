import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入 Element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入 axios
import axios from 'axios'
Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:8888/',
  timeout: 5000
})

Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small', zIndex: 2000 });

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
