<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="40px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入SQL查询" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item style="margin-left:50px" label="分组" prop="folderId">
        <el-select v-model="queryParams.folderId" placeholder="所属分组" clearable @keyup.enter.native="handleQuery">
                <el-option v-for="folder in folderList" :key="folder.id" :label="folder.name" :value="folder.id"/>
            </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddFolder"
                    >新增分组</el-button>
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    >新增SQL查询</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 添加或修改数据源对话框 -->
    <el-dialog title="添加分组" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left" style="margin-left: 20px;" >
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入分组名称" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>

    <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="数据源" align="center" prop="dataSourceName" />
        <el-table-column label="数据库" align="center" prop="databaseName" />
        <el-table-column label="分组" align="center" prop="folderName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-view" @click="showDetail(scope.row)"></el-button>
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
import { getSqlQueryList } from '@/api/metadata/sqlQuery';
import { getFolderListByType, addFolder } from '@/api/folder/folder';
export default {
    name:'SqlQuery',
    data() {
      return {

        // 遮罩层
        loading: true,
        open: false,
        showSearch:true,
        tableList:[],
        total: 0,
        selections: [],
        folderList: [],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          name: undefined,
          folderId: undefined,
        },
        form: {},
        rules: {
          name: [
            { required: true, message: "名称不能为空", trigger: "blur" }
          ]
        }
      }
    },

    created() {
      this.getList()
      this.getFolderList()
    },

    methods: {
      handleSelectionChange(val) {
        this.selections = val
      },

      getList() {
        this.loading = true;
        getSqlQueryList(this.queryParams).then(response => {
          this.tableList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });

      },

      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },

      handleAddFolder() {
        this.open = true
      },
      
      reset() {
        this.form = {
          name: undefined,
        }
        this.resetForm("form");
      },

      cancel() {
        this.reset()
        this.open = false;
      },

      // 数据源新增、修改提交方法
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const params = {
              ...this.form,
              type: 0,
            }
            addFolder(params).then(response => {
                this.$message({
                  type: "success",
                  message: '新增成功'
                })
                this.reset()
                this.open = false
                this.getFolderList()
              })
          }
        })
      },

      handleAdd() {
        this.$router.push({ path: "/metadata/sqlQuery/sqlEditor"});
      },
      
      handleUpdate(row) {
        this.$router.push({ path: "/metadata/sqlQuery/sqlEditor", query: {id: row.id}});
      },

      showDetail(row) {
        this.$router.push({ path: "/metadata/sqlQuery/sqlDetail", query: {id: row.id}});
      },

      getFolderList() {
        getFolderListByType(0).then(response => {
          this.folderList = response.data;
        })

      }
}
}
</script>

<style>

</style>