<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="82px">
        <el-form-item label="数据源名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入数据源名称" clearable @keyup.enter.native="handleQuery"/>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select v-model="queryParams.type" placeholder="数据源类型" clearable style="width: 120px">
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

          <!-- 添加或修改岗位对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="450px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left" style="margin-left: 20px;" >
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入数据源名称" />
          </el-form-item>
          <el-form-item label="类型" prop="type" >
            <el-select v-model="form.type" placeholder="数据源类型">
              <el-option v-for="dict in tpyeEnum" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)"/>
            </el-select>
          </el-form-item>
          <el-form-item label="主机" prop="host">
            <el-input v-model="form.host" placeholder="127.0.0.1" />
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="form.port" placeholder="3306" />
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" type="password" />
          </el-form-item>

          <el-form-item label="数据库" prop="database" >
            <el-input v-model="form.database" type="textarea" placeholder="请输入要访问的数据库，多个用英文逗号隔开"/>
          </el-form-item>
          
          <el-form-item label="状 态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="dict in statusEnum" :key="parseInt(dict.value)" :label="parseInt(dict.value)">
                {{dict.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-button :type="check.type"  :icon="check.icon" plain
            size="small" style="margin-left: 80px;" @click="checkConnection">测试连接
          </el-button>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>            
                  

      

  </div>
</template>

<script>
import { getDataSourceList, checkConnection, addDataSource, updateDataSource } from '@/api/metadata/dataSource';
export default {
    name:'DataSource',
    data() {
      return {

        // 遮罩层
        loading: true,
        exportLoading: false,
        // 显示搜索条件
        showSearch: true,
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: '',
        // 总条数
        total: 0,
        // 数据源列表数据
        dataSourceList:[],

        // check button样式控制
        check:{
          type: 'info',
          icon:'e-icon-connection',
          isPass: 0,
        },

        // 状态枚举
        statusEnum: [
          {
            label: "开启",
            value: 1
          },
          {
            label: "关闭",
            value: 0
          }
        ],

        // 数据源类型枚举
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
        },

        // 表单参数
        form: {},
        // 表单校验
        rules: {
          name: [
            { required: true, message: "名称不能为空", trigger: "blur" }
          ],
          type: [
            { required: true, message: "类型不能为空", trigger: "blur" }
          ],
          host: [
            { required: true, message: "主机不能为空", trigger: "blur" }
          ],
          port: [
            { required: true, message: "端口不能为空", trigger: "blur" }
          ],
          host: [
            { required: true, message: "主机不能为空", trigger: "blur" }
          ],
          userName: [
            { required: true, message: "用户名不能为空", trigger: "blur" }
          ],
          password: [
            { required: true, message: "密码不能为空", trigger: "blur" }
          ],
          database: [
            { required: true, message: "数据库不能为空", trigger: "blur" }
          ]
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

      reset() {
        this.form = {
          id: undefined,
          name: undefined,
          type: 0,
          host: undefined,
          port: undefined,
          userName: undefined,
          password: undefined,
          databaseList: undefined,
          status: 1
        }
        this.resetForm("form");
      },

      // 测试数据源连接方法 
      checkConnection() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const params = {
              ...this.form,
              databaseList: this.form.database.split(',')
            }
            delete params.database
            checkConnection(params).then(response => {
              this.$message({
                type: "success",
                message: '连接成功'
              })
              this.check.icon = 'el-icon-success'
              this.check.type = 'success'
              this.check.isPass = 1
            })

          }

        })
      },

      //点击新增按钮调用方法
      handleAdd() {
        this.reset()
        this.open = true
        this.title = "添加数据源"
      },


      // 点击编辑按钮
      handleUpdate(row) {
        this.reset();
        const param = {
          ...row,
          database: row.databaseList.join(",")
        }
        this.form = param
        this.open = true
        this.title="修改数据源"
      },


      

      //数据源新增、修改弹出框取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },

      // 数据源新增、修改提交方法
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {

            // 修改
            if (this.form.id !== undefined) {
              updateDataSource(this.form).then(response => {
                this.$message({
                  type: "success",
                  message: '修改成功'
                })
                this.open = false
                this.getList()
              });
            } else {
              // 新增
              addDataSource(this.form).then(response => {
                this.$message({
                  type: "success",
                  message: '新增成功'
                })
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },

      
      handleExport() {

      },

      handleDelete() {

      },

    }

}
</script>

<style>

</style>