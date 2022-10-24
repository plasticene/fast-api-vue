<template>
  <div>
    <app-main></app-main>
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
