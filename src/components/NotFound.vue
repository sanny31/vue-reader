<template>
  <div class="msg-container">
    <icon type="warn" is-msg></icon>
    <p>未找到该页面</p>
    <box gap="20px 10px">
      <x-button action-type="button" type="primary" @click.native="goBackHome">回到首页</x-button>
    </box>
  </div>
</template>
<script>
  import { Icon, XButton, Box } from 'vux'

  export default {
    name: 'NotFound',
    data () {
      return {}
    },
    components: {
      Icon,
      XButton,
      Box
    },
    computed: {},
    created: function () {},
    methods: {}
  }
</script>
<style lang="less" scoped>
.msg-container {
  text-align: center;
  padding-top: 60px;
  p {
    padding-top: 20px;
    font-size: 24px;
    line-height: 1.5;
  }
}
</style>

