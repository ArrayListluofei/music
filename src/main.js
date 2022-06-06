// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import './axios'
import axios from 'axios'
import './element'
import router from './router'
import Plugin from 'v-fit-columns'
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import tool from './tool'

// 监听localstorage
Vue.use(tool)

// 视频播放
Vue.use(VideoPlayer)

Vue.use(Plugin)

Vue.config.productionTip = false
// 网络
Vue.prototype.$http = axios
// 接口地址
axios.defaults.baseURL = '/lf'

// axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.localStorage.getItem('token')
  return config
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
