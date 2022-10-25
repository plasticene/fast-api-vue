<template>
  <div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>
import DataSource from '@/views/metadata/DataSource.vue'
import AppMain from '@/layout/AppMain.vue'
export default {
  name: 'App',
  components: {
    DataSource,
    AppMain
  }
}
</script>

<style lang="less">
  html,body,h3, p {
    margin: 0;
    padding: 0
  }
</style>
