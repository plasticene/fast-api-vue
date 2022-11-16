<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="72px">
        <el-form-item label="API名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入API名称" clearable @keyup.enter.native="handleQuery"/>
        </el-form-item>

        <el-form-item style="margin-left:50px" label="分组" prop="folderId">
            <el-select v-model="queryParams.folderId" placeholder="所属分组" clearable @keyup.enter.native="handleQuery">
                <el-option v-for="folder in folderList" :key="folder.id" :label="folder.name" :value="folder.id"/>
            </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="API状态" clearable style="width: 120px">
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
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddFolder"
                        >新增分组</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                        >新增API</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="apiInfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="路径" align="center" prop="path" />
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            <dict-tag :dictEnum="tpyeEnum" :value="scope.row.type"/>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :dictEnum="statusEnum" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <!-- <el-table-column label="数据源" align="center" prop="dataSourceName" /> -->
        <el-table-column label="分组" align="center" prop="folderName" />
        <el-table-column label="发布时间" align="center" prop="releaseTime" width="180px">
            <template slot-scope="scope">
                <span>{{ parseTime(scope.row.releaseTime) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center"  width="270px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" :icon="scope.row.isPass ? 'el-icon-success' : 'el-icon-circle-check'" @click="smokeTest(scope.row)">冒烟</el-button>
            <el-button size="mini" type="text" icon="el-icon-s-promotion" @click="releaseApi(scope.row)" :disabled="!scope.row.isCanRelease">发布</el-button>
            <el-button size="mini" type="text" icon="el-icon-bottom" @click="offlineApi(scope.row)" :disabled="!scope.row.isCanOffline">下线</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                  @pagination="getList"/>

  </div>
</template>

<script>
import {getApiInfoList, somkeTest, releaseApi, offlineApi} from '@/api/apiManager/apiInfo'
import { getFolderListByType } from '@/api/folder/folder'
export default {
    name: 'ApiInfo',
    data() {
        return {


            loading: false,
            total: 0,
            apiInfoList:[],
            folderList:[],
            // 显示搜索条件
            showSearch: true,
            // 状态枚举  不知道这么维护枚举值是否合理？？？？？？
            statusEnum: [
                {
                    label: "草稿",
                    value: 0
                },
                {
                    label: "已发布",
                    value: 1
                },
                {
                    label: "已更新",
                    value: 2,
                },
                {
                    label: "已下线",
                    value: 3
                }
            ],
            // 数据源类型枚举
            tpyeEnum:[
                {
                    label: 'GET',
                    value: 0
                },
                {
                    label: 'POST',
                    value: 1
                }
            ],
            // 查询参数
            queryParams: {
            pageNo: 1,
            pageSize: 10,
            name: undefined,
            folderId: undefined,
            status: undefined
            },

        }
    },

    created() {
        this.getList()
        this.getFolderList()
    },

    methods: {

        getList() {
            this.loading = true;
            getApiInfoList(this.queryParams).then(response => {  
                this.apiInfoList = response.data.list;
                this.apiInfoList.forEach(apiInfo => {
                    if (apiInfo.isPass && apiInfo.status !== 1) {
                        apiInfo.isCanRelease = true
                    }
                    if (apiInfo.status === 1 || apiInfo.status === 2) {
                        apiInfo.isCanOffline = true
                    }
                })
                this.total = response.data.total;
                this.loading = false;
            });
        },

        getFolderList() {
            getFolderListByType(1).then(response => {
                this.folderList = response.data;
            })
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

      handleAddFolder() {
    
      },

      handleAdd() {
        this.$router.push({ path: "/api/info/create"});
      },

      handleUpdate(row) {
        this.$router.push({ path: "/api/info/create", query: {id: row.id}});
      },

      handleSelectionChange() {
        
      },

      smokeTest(row) {
        somkeTest(row.id).then(response => {
            this.$message({
                  type: "success",
                  message: '冒烟测试通过'
                })
            this.getList()
        })
      },

      releaseApi(row) {
        releaseApi(row.id).then(response => {
            this.$message({
                  type: "success",
                  message: '发布成功'
                })
            this.getList()
        })
      },

      offlineApi(row) {
        this.$confirm('是否下线该API，下线之后将不能再使用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
              offlineApi(row.id).then(() => {
                  this.$message({
                      type: 'success',
                      message: '下线成功!'
                  });
                  // 重新获取列表的接口
                  this.getList()
              })
              
          }).catch(() => {});
      }


      
    }

}
</script>

<style>

</style>