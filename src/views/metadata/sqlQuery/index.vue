<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="82px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入SQL查询" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="名称" prop="folderId">
        <el-input v-model="queryParams.folderId" placeholder="所属分组" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="sqlQueryList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="数据源" align="center" prop="dataSourceName" />
        <el-table-column label="数据库" align="center" prop="databaseName" />
        <el-table-column label="分组" align="center" prop="folderName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-view" @click="handleUpdate(scope.row)"></el-button>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                  @pagination="getList"/>
  </div>
</template>

<script>
export default {
    name:'SqlQuery',
    data() {
      return {

        // 遮罩层
        loading: false,
        showSearch:true,
        sqlQueryList:[],
        selections:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          name: undefined,
          folderId: undefined,
        },
      }
    },

    methods: {
      handleSelectionChange(val) {
        this.selections = val
      },
      
      getList() {

      },

      handleQuery() {

      },

      resetQuery() {

      },

      handleAdd() {
        this.$router.push({ path: "/metadata/sqlQuery/sqlEditor"});
      },
}
}
</script>

<style>

</style>