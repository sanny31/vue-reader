import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({})

store.registerModule('vux', {
  state: {
    direction: 'forward'
  },
  mutations: {
    updateDirection (state, payload) {
      state.direction = payload.direction
    }
  }
})

store.registerModule('reader', {
  state: {
    userInfo: {
      'accessToken': '',
      'userid': '',
      'name': '',
      'telphone': '',
      'avatar': ''
    },
    dividerBottomText: '已经到底啦',
    bookCategories: [],
    currentBook: null
  },
  actions: {
    setUserInfo ({commit}, userInfo) {
      commit('SETUSERINFO', userInfo)
    },
    clearUserInfo ({commit}) {
      commit('CLEARUSERINFO')
    },
    setBookCategories ({commit}, info) {
      commit('SETBOOKCATEGORIES', info)
    },
    setCurrentBook ({commit}, info) {
      commit('SETCURRENTBOOK', info)
    }
  },
  mutations: {
    SETUSERINFO (state, userInfo) {
      state.userInfo = userInfo
    },
    CLEARUSERINFO (state) {
      state.userInfo.accessToken = ''
      state.userInfo.userid = ''
      state.userInfo.name = ''
      state.userInfo.telphone = ''
      state.userInfo.avatar = ''
    },
    SETBOOKCATEGORIES (state, info) {
      state.bookCategories = info
    },
    SETCURRENTBOOK (state, info) {
      state.currentBook = info
    }
  },
  getters: {
    getUserInfo (state) {
      return state.userInfo
    },
    getLoginStatus (state) {
      return state.userInfo.accessToken !== ''
    },
    getBookCategories (state) {
      return state.bookCategories
    },
    getCurrentBook (state) {
      return state.currentBook
    }
  }
})

export default store
