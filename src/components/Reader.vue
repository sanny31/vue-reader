<template>
  <div class="reader">
    <reader-body ref="reader" :header="book.Header" :title="currentChapter.Title" :content="currentChapter.Content" @on-no-prev-page="noPrevPage" @on-no-next-page="noNexPage"></reader-body>
    <tabbar class="reader-toolbar">
      <tabbar-item @on-item-click="goBack">
        <span slot="icon"><x-icon type="ios-undo-outline" size="28"></x-icon></span>
        <span slot="label">返回</span>
      </tabbar-item>
      <tabbar-item @on-item-click="prevChapter">
        <span slot="icon"><x-icon type="ios-arrow-thin-left" size="28"></x-icon></span>
        <span slot="label">上一章</span>
      </tabbar-item>
      <tabbar-item @on-item-click="nextChapter">
        <span slot="icon"><x-icon type="ios-arrow-thin-right" size="28"></x-icon></span>
        <span slot="label">下一章</span>
      </tabbar-item>
      <tabbar-item show-dot @on-item-click="showBookDetail=true">
        <span slot="icon"><x-icon type="ios-book-outline" size="28"></x-icon></span>
        <span slot="label">书刊信息</span>
      </tabbar-item>
      <tabbar-item @on-item-click="showBookChapters=true">
        <span slot="icon"><x-icon type="ios-list-outline" size="28"></x-icon></span>
        <span slot="label">目录</span>
      </tabbar-item>
    </tabbar>
    <div v-transfer-dom>
      <x-dialog v-model="showBookDetail">
        <div class="book-detail-dialog-container">
          <div class="cover" :style="{backgroundImage: 'url(' + book.Cover + ')'}"></div>
          <div class="name">{{book.Name}}</div>
          <div class="desc" v-html="book.Desc"></div>
          <div @click="showBookDetail=false">
            <span class="vux-close"></span>
          </div>
        </div>
      </x-dialog>
      <popup v-model="showBookChapters" position="right" width="60%">
        <group title="章节">
          <radio title="title" :options="chaptersForList" v-model="currentChapterIdx" @on-change="chapterChanged"></radio>
        </group>
      </popup>
    </div>
  </div>
</template>
<script>
  import { TransferDomDirective as TransferDom, Tabbar, TabbarItem, XDialog, Group, Popup, Radio } from 'vux'
  import axios from 'axios'
  import ReaderBody from './ReaderBody.vue'

  export default {
    name: 'Reader',
    data () {
      return {
        book: {
          Name: '标题',
          Desc: '简述',
          Header: '页眉',
          Chapters: []
        },
        chaptersForList: [],
        currentChapterIdx: 0,
        currentChapter: {},
        showBookDetail: false,
        showBookChapters: false
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Tabbar,
      TabbarItem,
      Group,
      XDialog,
      Popup,
      Radio,
      ReaderBody
    },
    computed: {},
    created: function () {},
    mounted: function () {},
    activated: function () {
      let vm = this
      if (vm.$store.getters.getCurrentBook) {
        vm.book = vm.$store.getters.getCurrentBook
      }
      if (vm.book) {
        vm.chaptersForList = []
        vm.book.Chapters.forEach(function (item, index) {
          vm.chaptersForList.push({key: index.toString(), value: item.Title})
        })
        vm.currentChapterIdx = 0
        if (vm.book.Chapters[0] && vm.book.Chapters[0].Content === undefined) {
          vm.fetchChapter(0)
        } else {
          vm.currentChapter = vm.book.Chapters[0]
        }
      } else {
        vm.goBackHome()
      }
    },
    deactivated: function () {},
    methods: {
      fetchChapter: function (idx) {
        let vm = this
        axios.get('/api/book/chapter', {params: {id: vm.book.Chapters[idx].Id}}).then((res) => {
          if (res.data) {
            vm.book.Chapters[idx].Content = res.data.Content
            vm.currentChapter = vm.book.Chapters[idx]
          }
        })
      },
      chapterChanged: function (value) {
        this.showBookChapters = false
        if (this.book.Chapters[value] && this.book.Chapters[value].Content === undefined) {
          this.fetchChapter(value)
        } else {
          this.currentChapter = this.book.Chapters[value]
        }
      },
      prevChapter: function () {
        if (this.book.Chapters.length > 1 && this.currentChapterIdx > 0) {
          this.currentChapterIdx--
          return true
        } else {
          this.$vux.toast.show({
            text: '已到第一章'
          })
          return false
        }
      },
      nextChapter: function () {
        if (this.book.Chapters.length > 1 && this.currentChapterIdx < this.book.Chapters.length - 1) {
          this.currentChapterIdx++
          return true
        } else {
          this.$vux.toast.show({
            text: '已到最末章'
          })
          return false
        }
      },
      noPrevPage: function () {
        let vm = this
        if (vm.prevChapter() === true) {
          setTimeout(function () {
            vm.$nextTick(() => {
              vm.$refs.reader.render(true)
            })
          }, 100)
        }
      },
      noNexPage: function () {
        let vm = this
        if (vm.nextChapter() === true) {
          setTimeout(function () {
            vm.$nextTick(() => {
              vm.$refs.reader.render()
            })
          }, 100)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
