<template>
  <span>
    <template v-for="(dict, index) in dictEnum">

      <span v-if="value === dict.value" :key="dict.value" style="color:#13227a" :index="index" :class="dict.cssClass">{{ dict.label }}</span>

    </template>
  </span>
</template>

<script>
export default {
  name: 'DictTag',
  props: ['value', 'dictEnum']
}
</script>
  <style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  </style>
