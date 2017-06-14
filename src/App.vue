<template>
  <div id="app" style="height:100%;">
    <view-box ref="viewBox" :body-padding-top="showHeader?'46px':'0px'" :body-padding-bottom="'0px'">
      <x-header slot="header" class="header" :left-options="leftOptions" :title="title" :transition="headerTransition" v-show="showHeader"></x-header>
      <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
        <keep-alive>
          <router-view class="router-view"></router-view>
        </keep-alive>
      </transition>
    </view-box>
  </div>
</template>

<script>
import { ViewBox, XHeader, TransferDomDirective as TransferDom, Tabbar, TabbarItem } from 'vux'
import { mapState } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      showBack: true
    }
  },
  directives: {
    TransferDom
  },
  components: {
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem
  },
  methods: {},
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      deviceready: state => state.app.deviceready,
      direction: state => state.vux.direction
    }),
    title () {
      if (this.route.path === '/index') return '首页'
      if (this.route.path === '/books') return '书刊'
      if (this.route.path === '/reader') return '阅读器'
      return '未找到该页面'
    },
    leftOptions () {
      return {
        showBack: this.route.path !== '/index'
      }
    },
    showHeader () {
      return this.route.path === '/index' || this.route.path === '/books'
    },
    headerTransition () {
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/close.less';
@import 'styles/shared.less';
@import 'styles/reader.less';
</style>
