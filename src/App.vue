<template>
  <div id="app">
    <data-source></data-source>
  </div>
</template>

<script>
import DataSource from '@/views/metadata/DataSource.vue'
export default {
  name: 'App',
  components: {
    DataSource,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
