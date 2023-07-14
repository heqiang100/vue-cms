<template>
  <div class="app-container home">
    <a class="toBlog">欢迎来到测试平台管理后台</a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: true,
      origin: '',
      id: ''
    }
  },
  mounted () {
    this.origin = window.location.origin
    this.id = window.btoa(this.$store.state.user.userInfo.user.id)
  }
}
</script>

<style scoped lang="scss">
  .home{
    .toBlog{
      color: teal;
    }
  }
</style>
