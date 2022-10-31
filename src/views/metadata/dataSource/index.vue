<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="82px">
        <el-form-item label="数据源名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入数据源名称" clearable @keyup.enter.native="handleQuery"/>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select v-model="queryParams.status" placeholder="数据源类型" clearable style="width: 120px">
            <el-option v-for="dict in tpyeEnum" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)"/>
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="数据源状态" clearable style="width: 120px">
            <el-option v-for="dict in statusEnum" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)"/>
          </el-select>
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
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleAdd"
                     >编辑</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleAdd"
                     >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                     >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="dataSourceList">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            <dict-tag :dictEnum="tpyeEnum" :value="scope.row.type"/>
          </template>
        </el-table-column>
        <el-table-column label="主机" align="center" prop="host" />
        <el-table-column label="端口" align="center" prop="port" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="green"
              inactive-color="e6e6e6"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column  label="数据库" align="center">
          <template slot-scope="scope">
            <span>{{database(scope.row)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="数据库" align="center" prop="databaseList" /> -->
        <el-table-column label="用户名" align="center" prop="userName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
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
import { getDataSourceList } from '@/api/metadata/dataSource';
export default {
    name:'DataSource',
    data() {
      return {

        // 遮罩层
        loading: true,
        exportLoading: false,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 数据源列表数据
        dataSourceList:[],

        statusEnum: [
          {
            label: "关闭",
            value: 0
          },
          {
            label: "开启",
            value: 1
          }
        ],

        tpyeEnum:[
          {
            label: 'MySQL',
            value: 0
          },
          {
            label: 'ClickHouse',
            value: 1
          },
          {
            label: 'Doris',
            value: 2
          },
          {
            label: 'Oracle',
            value: 3
          }
        ],
    

        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          name: undefined,
          type: undefined,
          status: undefined
        }
      }
    },

    computed: {
      database() {
        return dataSource => {
          const databaseList = dataSource.databaseList
          if (databaseList !== undefined && databaseList.length > 0) {
            return databaseList.join(', ')
          } else {
            return ''
          }
        }
      }

    },

    created() {
      this.getList();
    },

    methods: {

      getList() {
        this.loading = true;
        getDataSourceList(this.queryParams).then(response => {
          this.dataSourceList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });

      },

       /** 搜索按钮操作 */
       handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },

      handleAdd() {

      },

      handleExport() {

      },

      handleUpdate(row) {

      },

      handleDelete() {

      }

    }

}
</script>

<style>

</style>