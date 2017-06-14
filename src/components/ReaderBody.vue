<template>
  <div class="reader-body" @touchstart="_onTouchStart" @mousedown="_onTouchStart">
    <div class="reader-header" v-html="header"></div>
    <div class="reader-main" ref="readerMain" :style="{'transform' : 'translate3d(' + dataForTransition.translateX + 'px, 0, 0)','transition-duration': dataForTransition.transitionDuration + 'ms'}" @transitionend="_onTransitionEnd">
      <div class="reader-title">{{title}}</div>
      <div class="reader-content" v-html="content"></div>
    </div>
    <div class="reader-progress">{{progressText}}</div>
  </div>
</template>
<script>
  export default {
    props: {
      header: String,
      title: String,
      content: String,
      speed: {
        type: Number,
        default: 500
      }
    },
    data () {
      return {
        pageWidth: 0,
        pageHeight: 0,
        page: 1,
        totalPage: 1,
        lastPage: 1,
        dataForTransition: {
          delta: 0,
          startPos: null,
          transitioning: false,
          translateX: 0,
          startTranslate: 0,
          transitionDuration: 0
        }
      }
    },
    watch: {
      'content': function () {
        console.log('content changed')
        this.render()
      }
    },
    computed: {
      progressText: function () {
        return '当前是' + this.page + '页 共' + this.totalPage + '页 进度' + Math.round((this.page / this.totalPage) * 100) + '%'
      },
      totalWidth: function () {
        return this.pageWidth * this.totalPage
      },
      position: function () {
        return (this.page - 1) * this.pageWidth
      }
    },
    methods: {
      _init () {
        this.$refs.readerMain.style.height = 'auto'
        this.$refs.readerMain.style.width = '100%'
        this.$refs.readerMain.style.columnCount = 'initial'
        this.totalPage = 1
        this.dataForTransition.delta = 0
        this.dataForTransition.transitionDuration = 0
        this.dataForTransition.translateX = 0
      },
      render (backward = false) {
        this.$nextTick(() => {
          this._init()
          this.pageHeight = parseInt(window.screen.height - 54)
          this.pageWidth = parseInt(window.screen.width)

          let originalHeight = parseInt(this.$refs.readerMain.getBoundingClientRect().height)
          let tmpTotalPage = Math.ceil(originalHeight / this.pageHeight)
          this.totalPage = Math.ceil((originalHeight + tmpTotalPage * 70) / this.pageHeight)

          // console.log('originalHeight:' + originalHeight + ' pageHeight:' + this.pageHeight)
          // console.log('pageWidth:' + this.pageWidth + ' totalPage:' + this.totalPage)
          this.$refs.readerMain.style.height = '100%'
          this.$refs.readerMain.style.width = this.pageWidth * this.totalPage + 'px'
          this.$refs.readerMain.style.columnCount = this.totalPage

          if (backward === false) {
            this.page = 1
          } else {
            this.page = this.totalPage
          }
          this.dataForTransition.translateX = this._getTranslateOfPage(this.page)
        })
      },
      setPage (page) {
        this.lastPage = this.page
        if (page < 1) {
          this.$emit('on-no-prev-page')
        } else if (page > this.totalPage) {
          this.$emit('on-no-next-page')
        } else {
          this.page = page
          this._setTranslate(this._getTranslateOfPage(this.page))
          this._onTransitionStart()
        }
      },
      prevPage () {
        this.setPage(this.page - 1)
      },
      nextPage () {
        this.setPage(this.page + 1)
      },
      _revertPage () {
        this.setPage(this.page)
      },
      _getTouchPos (e) {
        return e.changedTouches ? e.changedTouches[0]['pageX'] : e['pageX']
      },
      _setTranslate (value) {
        this.dataForTransition.translateX = value
      },
      _getTranslate () {
        return this.dataForTransition.translateX
      },
      _getTranslateOfPage (page) {
        if (page < 1) {
          return 0
        } else if (page > this.totalPage) {
          return -(this.totalPage - 1) * this.pageWidth
        } else {
          return -(page - 1) * this.pageWidth
        }
      },
      _onTransitionStart () {
        this.dataForTransition.transitioning = true
        this.dataForTransition.transitionDuration = this.speed
      },
      _onTransitionEnd () {
        this.dataForTransition.transitioning = false
        this.dataForTransition.transitionDuration = 0
        this.dataForTransition.delta = 0
      },
      _onTouchStart (e) {
        this.dataForTransition.startPos = this._getTouchPos(e)
        this.dataForTransition.delta = 0
        this.dataForTransition.startTranslate = this._getTranslateOfPage(this.page)
        this.dataForTransition.startTime = new Date().getTime()
        this.dataForTransition.transitionDuration = 0
        document.addEventListener('touchmove', this._onTouchMove, false)
        document.addEventListener('touchend', this._onTouchEnd, false)
        document.addEventListener('mousemove', this._onTouchMove, false)
        document.addEventListener('mouseup', this._onTouchEnd, false)
      },
      _onTouchMove (e) {
        this.dataForTransition.delta = this._getTouchPos(e) - this.dataForTransition.startPos
        this._setTranslate(this.dataForTransition.startTranslate + this.dataForTransition.delta)
        if (Math.abs(this.dataForTransition.delta) > 0) {
          e.preventDefault()
        }
      },
      _onTouchEnd (e) {
        this.dataForTransition.transitionDuration = this.speed
        var isQuickAction = new Date().getTime() - this.dataForTransition.startTime < 1000
        if (this.dataForTransition.delta < -100 || (isQuickAction && this.dataForTransition.delta < -15)) {
          this.nextPage()
        } else if (this.dataForTransition.delta > 100 || (isQuickAction && this.dataForTransition.delta > 15)) {
          this.prevPage()
        } else {
          this._revertPage()
        }
        document.removeEventListener('touchmove', this._onTouchMove)
        document.removeEventListener('touchend', this._onTouchEnd)
        document.removeEventListener('mousemove', this._onTouchMove)
        document.removeEventListener('mouseup', this._onTouchEnd)
      }
    },
    created () {},
    mounted () {
      window.addEventListener('resize', this.render)
    },
    activated () {},
    deactivated () {}
  }
</script>
<style lang="less" scoped>
</style>
