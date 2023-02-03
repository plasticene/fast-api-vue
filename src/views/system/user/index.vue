<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="60px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="请输入手机号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 120px">
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
          <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                  >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="userList">
      <el-table-column label="序号" align="center" type="index" width="55" />
      <el-table-column label="用户名" align="center" prop="username" />
      <el-table-column label="手机号" align="center" prop="mobile" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="-1" @change="handleStatusChange(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                      >修改</el-button>
          <el-dropdown @command="(command) => handleCommand(command, scope.$index, scope.row)">
            <el-button style="margin-left: 10px;" size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleDelete" v-if="scope.row.id !== 1" size="mini" type="text" icon="el-icon-delete"
                                >删除</el-dropdown-item>
              <el-dropdown-item command="handleResetPwd" size="mini" type="text" icon="el-icon-key"
                                >重置密码</el-dropdown-item>
              <el-dropdown-item command="handleRole" size="mini" type="text" icon="el-icon-circle-check"
                                >分配角色</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.id === undefined" label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.id === undefined" label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手机号" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="form.gender" placeholder="请选择">
                <el-option v-for="dict in genderEnum" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.postIds" multiple placeholder="请选择">
                <el-option
                    v-for="item in postOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusEnum" :key="parseInt(dict.value)" :label="parseInt(dict.value)">
                  {{dict.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
  
</template>

<script>
import {getUserList} from '@/api/system/user'
export default {
  name: 'User',
  data() {
    return {

      // 遮罩层
      loading: true,
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      roleList:[],
      total:0,
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: '',
      userList: [],
      total: 0,
      // 搜索参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: undefined,
        username: undefined,
        mobile: undefined
      },
      form:{},
      // 表单校验
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            required:true,
            pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      statusEnum: [
        {
          label: '开启',
          value: 0
        },
        {
          label: '关闭',
          value: -1
        }
      ],
      genderEnum: [
        {
          label: '男',
          value: 0
        },
        {
          label: '女',
          value: 1
        }
      ]

    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.loading = true
      getUserList(this.queryParams).then(response => {
        this.userList = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },

    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        username: undefined,
        name: undefined,
        password: undefined,
        mobile: undefined,
        email: undefined,
        gender: undefined,
        status: 0,
        remark: undefined,
        roleIds: []
      };
      this.resetForm("form");
    },

    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加用户'
    }





  }

}
</script>

<style>

</style>