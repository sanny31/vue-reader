// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import App from './App'
import { DevicePlugin, ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin, WechatPlugin } from 'vux'
import axios from 'axios'
import Qs from 'qs'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(DevicePlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)

FastClick.attach(document.body)

Vue.use(VueLazyload)

Vue.use(VueRouter)

sync(store, router)

const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

router.beforeEach(function (to, from, next) {
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', {direction: 'forward'})
    } else {
      store.commit('updateDirection', {direction: 'reverse'})
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', {direction: 'forward'})
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})

router.afterEach(function (to) {
})

axios.defaults.timeout = 8000
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8'
axios.defaults.baseURL = process.env.SERVER_BASEURL

axios.interceptors.request.use((config) => {
  Vue.$vux.loading.show()
  if (config.method === 'post' || config.method === 'put') {
    config.data = Qs.parse(config.data, {arrayFormat: 'brackets'})
  }
  if (store.getters.getUserInfo.accessToken !== undefined && store.getters.getUserInfo.accessToken !== '') {
    config.headers.Authorization = store.getters.getUserInfo.accessToken
  }
  return config
}, (error) => {
  Vue.$vux.toast.show({text: '非法输入', type: 'text', time: 1000})
  return Promise.reject(error)
})

axios.interceptors.response.use((res) => {
  Vue.$vux.loading.hide()
  return res
}, (error) => {
  Vue.$vux.loading.hide()
  console.error(error)
  if (error.response) {
    switch (error.response.status) {
      case 401:
        window.location.href = process.env.SERVER_BASEURL + '/Account/Authorize'
        break
      default:
        Vue.$vux.toast.show({text: '网络异常', type: 'text', time: 1000})
    }
  }
  return Promise.reject(error)
})

Vue.prototype.utils = {
  test: function () {
    console.log('test')
  },
  getStyle: function (dom, attr) {
    return dom.currentStyle ? dom.currentStyle[attr] : getComputedStyle(dom, false)[attr]
  }
}

Vue.mixin({
  methods: {
    goBack: function () {
      router.back()
    },
    goBackHome: function () {
      router.push('/index')
    },
    linkToReader: function (item) {
      this.$store.dispatch('setCurrentBook', item)
      router.push('/reader')
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
