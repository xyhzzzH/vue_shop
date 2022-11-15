import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment/moment'
import './plugins/element.js'
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
 
// 导入富文本呢编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

 
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须返回config
  return config
})
// 将富文本编辑器注册为全局可用的属性
Vue.use(VueQuillEditor)
Vue.component('tree-table', ZkTable)
Vue.filter('dateFormat',originVal => {
  const dt = new Date(originVal)
  return moment(dt).format('YYYY-MM-DD hh:mm:ss')})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
