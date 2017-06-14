<template>
  <div>
    <div>
      <swiper :list="listForSwiper"></swiper>
      <group>
        <cell title="更多热门书刊" is-link link="/books">
          <x-icon slot="icon" type="ios-book-outline" size="20"></x-icon>
        </cell>
      </group>
      <flexbox :gutter="0" wrap="wrap">
        <flexbox-item :span="1/2" v-for="(item, index) in result" :key="index">
          <div class="book-container" @click="linkToReader(item)">
            <div class="media" :style="{backgroundImage: 'url(' + item.Cover + ')'}"></div>
            <div class="title">{{item.Name}}</div>
            <div class="desc"><badge :text="item.Category"></badge></div>
          </div>
        </flexbox-item>
      </flexbox>
      <divider>{{dividerBottomText}}</divider>
    </div>
  </div>
</template>
<script>
  import { Divider, Group, Cell, Flexbox, FlexboxItem, Badge, Swiper } from 'vux'
  import { mapState } from 'vuex'
  import axios from 'axios'

  export default {
    name: 'Home',
    data () {
      return {
        listForSwiper: [{
          url: 'javascript:',
          img: 'https://static.vux.li/demo/1.jpg',
          title: '送你一朵花'
        }, {
          url: 'javascript:',
          img: 'https://static.vux.li/demo/2.jpg',
          title: '送你一辆车'
        }, {
          url: 'javascript:',
          img: 'https://static.vux.li/demo/3.jpg',
          title: '送你一次旅行'
        }],
        result: []
      }
    },
    components: {
      Divider,
      Group,
      Cell,
      Flexbox,
      FlexboxItem,
      Badge,
      Swiper
    },
    computed: {
      ...mapState({
        dividerBottomText: state => state.reader.dividerBottomText
      })
    },
    created: function () {},
    mounted: function () {
      this.getBooks()
    },
    activated: function () {},
    deactivated: function () {},
    methods: {
      getBooks () {
        let vm = this
        axios.get('/api/book/books', {params: {count: 6}}).then((res) => {
          let result = res.data
          for (let item of result) {
            vm.result.push(item)
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
