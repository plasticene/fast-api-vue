<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="82px">
      <el-form-item label="角色名称" prop="name">
      <el-input v-model="queryParams.name" placeholder="请输入菜单名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="角色标识" prop="code">
      <el-input v-model="queryParams.code" placeholder="请输入菜单接口标识" clearable @keyup.enter.native="handleQuery"/>
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
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="menuList" row-key="id" :default-expand-all="isExpandAll"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="code" label="权限标识" align="center" ></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template v-slot="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" align="center"></el-table-column>
      <el-table-column prop="component" label="组件" align="center"></el-table-column>
      <el-table-column prop="seq" label="排序" width="60" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="switchStatus(scope.row)"
            />
          </template>
        </el-table-column>
      <!-- <el-table-column label="创建时间" align="center" prop="createTime">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     >修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)"
                     >新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

     <!-- 添加或修改菜单对话框 -->
     <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect v-model="form.parentId" :options="menuOptions" :normalizer="normalizer" :show-count="true"
                          placeholder="选择上级菜单"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio v-for="dict in menuTypeEmum" :key="parseInt(dict.value)" :label="parseInt(dict.value)">
                  {{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.type !== 1" label="菜单图标">
              <el-input v-model="form.icon" placeholder="请输入图标" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type !== 1" label="路由地址" prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`。如需外网地址时，则以 `http(s)://` 开头" placement="top">
                <i class="el-icon-question" />
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.type === 0">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type === 1" label="权限标识">
              <span slot="label">
                <el-tooltip content="Controller 方法上的权限字符，如：@PreAuthorize(`@ss.hasPermission('system:user:list')`)" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                权限字符
              </span>
              <el-input v-model="form.code" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单状态" prop="status">
              <span slot="label">
                <el-tooltip content="选择停用时，路由将不会出现在侧边栏，也不能被访问" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                菜单状态
              </span>
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusEnum"
                          :key="dict.value" :label="parseInt(dict.value)">{{dict.label}}</el-radio>
              </el-radio-group>
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
import {getMenuList, addMenu, updateMenu, deleteMenu} from '@/api/system/menu'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    name:'Menu',
    components:{
      Treeselect
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
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
            { required: true, message: "菜单名称不能为空", trigger: "blur" }
          ],
          sort: [
            { required: true, message: "菜单顺序不能为空", trigger: "blur" }
          ],
          path: [
            { required: true, message: "路由地址不能为空", trigger: "blur" }
          ],
          status: [
            { required: true, message: "状态不能为空", trigger: "blur" }
          ]
        },

        menuTypeEmum:[
          {
            label: '菜单',
            value: 0
          },
          {
            label: '按钮',
            value: 1
          }
        ],
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
      }

    },

    created() {
      this.getList()
    },

    methods: {

      getList() {
        this.loading = true,
        getMenuList(this.queryParams).then(response => {
          this.menuList = response.data
          this.loading = false
        })
      },

      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          parentId: 0,
          name: undefined,
          icon: undefined,
          type:0,
          status:1
  
        };
        this.resetForm("form");
      },

      getTreeSelect() {
        this.menuOptions = [];
        const menu = { id: 0, name: '主类目', children: [] };
        menu.children = this.handleTree(this.menuList, "id");
        this.menuOptions.push(menu);
      },

      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        };
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },

      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },

      handleAdd(row) {
        this.reset();
        this.getTreeSelect();
        console.log("menuOptions:", this.menuOptions)
        if (row != null && row.id) {
          this.form.parentId = row.id;
        } else {
          this.form.parentId = 0;
        }
        this.open = true;
        this.title = "添加菜单";
      },

      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            // 若权限类型为目录或者菜单时，进行 path 的校验，避免后续拼接出来的路由无法跳转
            // if (this.form.type === 0) {
            //   // 如果是外链，则不进行校验
            //   const path = this.form.path
            //   if (!isExternal(path)) {
            //     // 父权限为根节点，path 必须以 / 开头
            //     if (this.form.parentId === 0 && path.charAt(0) !== '/') {
            //       this.$modal.msgSuccess('前端必须以 / 开头')
            //       return
            //     } else if (this.form.parentId !== 0 && path.charAt(0) === '/') {
            //       this.$modal.msgSuccess('前端不能以 / 开头')
            //       return
            //     }
            //   }
            // }

            // 提交
            if (this.form.id !== undefined) {
              updateMenu(this.form).then(response => {
                this.$message({
                  type: "success",
                  message: '修改成功'
                })
                this.open = false;
                this.getList();
              });
            } else {
              addMenu(this.form).then(response => {
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



    }

}
</script>

<style>

</style>