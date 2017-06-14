<template>
  <div>
    <div style="height:93px;">
      <sticky scroll-box="vux_view_box_body" :offset="46" :check-sticky-support="false">
        <search v-model="searchParams.keyword" :autoFixed="false" placeholder="请输入关键词" @on-submit="searchByKeyword"></search>
        <group class="weui-cells_container-no-margin">
          <cell-box class="filter-row">
            <flexbox>
              <flexbox-item :span="6">
                <label class="title">分类：{{selectedCategoryText}}</label>
              </flexbox-item>
              <flexbox-item :span="6">
                <x-button class="btn" action-type="button" type="primary" mini @click.native="showFilterDialog=true">筛选</x-button>
              </flexbox-item>
            </flexbox>
          </cell-box>
        </group>
      </sticky>
    </div>
    <div v-transfer-dom>
      <popup v-model="showFilterDialog" position="right" width="60%">
        <group title="类别">
          <radio title="title" :options="categories" v-model="searchParams.category_id" @on-change="cateoryChanged"></radio>
        </group>
      </popup>
    </div>
    <scroller height="-141" lock-x scrollbar-y ref="mainScroller" use-pullup use-pulldown @on-pullup-loading="loadMoreProducts" :pullup-config="{height: 40, content: '上拉加载更多', loadingContent: '加载中...', downContent: '释放开始加载', upContent: '上拉加载更多'}" @on-pulldown-loading="refreshProducts" :pulldown-config="{content: '下拉刷新', loadingContent: '刷新中...', upContent: '释放开始刷新', downContent: '下拉刷新'}">
      <div>
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/2" v-for="(item, index) in result" :key="index">
            <div class="book-container" @click="linkToReader(item)">
              <div class="media" :style="{backgroundImage: 'url(' + item.Cover + ')'}"></div>
              <div class="title">{{item.Name}}</div>
              <div class="desc"><badge :text="item.Category"></badge></div>
            </div>
          </flexbox-item>
        </flexbox>
        <divider v-if="reachBottom">{{dividerBottomText}}</divider>
      </div>
    </scroller>
  </div>
</template>
<script>
  import { Divider, Box, Tab, TabItem, Search, Flexbox, FlexboxItem, Badge, Sticky, Scroller, Group, CellBox, XButton, TransferDomDirective as TransferDom, Popup, Radio } from 'vux'
  import { mapState } from 'vuex'
  import axios from 'axios'

  export default {
    name: 'Books',
    data () {
      return {
        fetching: true,
        searchParams: {
          category_id: '',
          keyword: '',
          page: 1
        },
        categories: [],
        selectedCategoryText: '全部',
        showFilterDialog: false,
        result: [],
        reachBottom: false
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Divider,
      Box,
      Tab,
      TabItem,
      Search,
      Flexbox,
      FlexboxItem,
      Badge,
      Sticky,
      Scroller,
      Group,
      CellBox,
      XButton,
      Popup,
      Radio
    },
    computed: {
      ...mapState({
        dividerBottomText: state => state.reader.dividerBottomText
      })
    },
    created: function () {
      this.fetchCategoryList()
    },
    mounted: function () {
      this.getList()
    },
    activated: function () {
      this.$refs.mainScroller.reset()
    },
    deactivated: function () {},
    methods: {
      fetchCategoryList: function () {
        let vm = this
        axios.get('/api/book/categories').then((res) => {
          vm.categories = [{key: '', value: '全部'}]
          res.data.forEach(function (item) {
            vm.categories.push({key: item.Id.toString(), value: item.Name})
          })
        })
      },
      getList () {
        let vm = this
        axios.get('/api/book/books', {params: vm.searchParams}).then((res) => {
          let result = res.data
          for (let item of result) {
            vm.result.push(item)
          }
          vm.fetching = false
          vm.$nextTick(() => {
            vm.$refs.mainScroller.donePullup()
            vm.$refs.mainScroller.donePulldown()
            if (result === null || result.length === 0) {
              vm.$refs.mainScroller.disablePullup()
              vm.reachBottom = true
            }
            vm.$refs.mainScroller.reset()
          })
        })
      },
      cateoryChanged: function (value) {
        let vm = this
        vm.categories.map(function (item, idx, arr) {
          if (item.key === value) {
            vm.selectedCategoryText = item.value
            vm.showFilterDialog = false
            if (vm.fetching === false) {
              vm.fetching = true
              vm.result = []
              vm.searchParams.page = 1
              vm.getList()
              vm.$refs.mainScroller.enablePullup()
            }
            return
          }
        })
      },
      searchByKeyword: function () {
        if (this.fetching === false) {
          this.fetching = true
          this.result = []
          this.searchParams.page = 1
          this.getList()
          this.$refs.mainScroller.enablePullup()
        }
      },
      loadMoreProducts: function () {
        if (this.fetching === false) {
          this.fetching = true
          this.searchParams.page += 1
          this.getList()
        } else {
          this.$refs.mainScroller.donePullup()
        }
      },
      refreshProducts: function () {
        if (this.fetching === false) {
          this.fetching = true
          this.result = []
          this.searchParams.page = 1
          this.getList()
          this.$refs.mainScroller.enablePullup()
        } else {
          this.$refs.mainScroller.donePulldown()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
