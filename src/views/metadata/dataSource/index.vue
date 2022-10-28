<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="seq"
      label="序号">
    </el-table-column>
    <el-table-column
      prop="name"
      label="数据源名称">
    </el-table-column>
    <el-table-column
      prop="type"
      label="数据源类型">
    </el-table-column>
    <el-table-column
      prop="host"
      label="主机"
      >
    </el-table-column>
    <el-table-column
      prop="port"
      label="端口">
    </el-table-column>
    <el-table-column
      prop="database"
      label="数据库">
    </el-table-column>
    <el-table-column
      prop="userName"
      label="用户名">
    </el-table-column>
    <el-table-column
      prop="date"
      label="日期">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
    name:'DataSource',
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    }

}
</script>

<style>

</style>