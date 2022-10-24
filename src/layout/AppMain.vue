<template>
   <div>
    <el-container>
      <el-aside width="auto">
        <side-bar></side-bar>
      </el-aside>
      <el-container>
          <el-header>
            <Header></Header>
          </el-header>
          <tags></tags>
          <el-main>
          </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from '@/layout/Header.vue'
import SideBar from '@/layout/SideBar.vue'
import Tags from '@/layout/Tags.vue'
export default {
    name:'AppMain',
    components:{
      Header,
      SideBar,
      Tags

    }

}
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>