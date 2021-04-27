// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')


Vue.use(VideoPlayer);



import axios from "axios";
Vue.prototype.$axios = axios;

import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

Vue.use(Element)

Vue.config.productionTip = false

import "../static/css/global.css"

// 让自定义配置生效
import settings from "./settings";

Vue.prototype.$settings = settings;



//导入极验证码
import "../static/js/gt.js"

import store from "./store/index"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

