<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="82px">
            <el-form-item label="角色名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入角色名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>

            <el-form-item label="角色标识" prop="code">
            <el-input v-model="queryParams.code" placeholder="请输入角色标识" clearable @keyup.enter.native="handleQuery"/>
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

        <el-table v-loading="loading" :data="roleList">
            <el-table-column label="序号" align="center" type="index" width="55" />
            <el-table-column label="角色名称" prop="name" align="center"  />
            <el-table-column label="角色标识" prop="code" align="center"  />
            <el-table-column label="角色类型" prop="isSystem" width="80" >
                <template slot-scope="scope">
                    <span>{{ scope.row.isSystem === 0 ? '自定义': '系统内置' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" >
                <template slot-scope="scope">
                <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" @change="handleStatusChange(scope.row)"/>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" >
                <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                            >修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleMenu(scope.row)"
                            >菜单权限</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                            >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

         <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="角色标识" prop="code">
                    <el-input v-model="form.code" placeholder="请输入角色标识" />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

    </div>
  
</template>

<script>
import {getRoleList, addRole, updateRole, deleteRole} from '@/api/system/role'
export default {
    name:'Role',
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
            // 查询参数
            queryParams: {
                pageNo: 1,
                pageSize: 10,
                name: undefined,
                code: undefined
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                name: [
                    { required: true, message: "角色名称不能为空", trigger: "blur" }
                ],
                code: [
                    { required: true, message: "角色标识不能为空", trigger: "blur" }
                ]
            },

        }
    },

    created() {
        this.getList()
    },

    methods: {
        reset() {
            this.form = {
                id: undefined,
                name: undefined,
                code: undefined,
                remark: undefined
            }
            this.resetForm("form");
        },
        getList() {
            this.loading = true;
            getRoleList(this.queryParams).then(response => {
                this.roleList = response.data.list
                this.total = response.data.total;
                this.loading = false;
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
        //点击新增按钮调用方法
        handleAdd() {
            this.reset()
            this.open = true
            this.title = "添加数据源"
        },

        handleUpdate(row) {
            this.reset();
            this.form = row
            this.open = true
            this.title="修改数据源"
        },

        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id !== undefined) {
                        updateRole(this.form).then(response => {
                            this.$message({
                            type: "success",
                            message: '更新成功'
                            })
                            this.open = false
                            this.getList()

                        })
                    } else {
                        addRole(this.form).then(response => {
                            this.$message({
                            type: "success",
                            message: '新增成功'
                            })
                            this.open = false
                            this.getList()
                        }) 
                    }
                   
                }
            })

        },
        cancel() {
            this.reset()
            this.open = false;
        },




    }

}
</script>

<style>

</style>