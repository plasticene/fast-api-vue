<template>
  <div class="app-container">
    <h3 style="margin-top: 5px;"> {{title}} </h3>
    <el-divider></el-divider>
    <el-form inline ref="form" :model="form" :rules="rules" label-width="80px" label-position="left" style="margin-left: 20px;" >
        <el-form-item label="名称" prop="name" style="width: 600px">
            <el-input v-model="form.name" placeholder="请输入名称" style="width: 300px" />
        </el-form-item>

        <el-form-item label="分组" prop="folderId" style="width: 600px">
            <el-select v-model="form.folderId" placeholder="数据库" clearable>
                <el-option v-for="folder in folderList" :key="folder.id" :label="folder.name" :value="folder.id"/>
            </el-select>
        </el-form-item>

        <el-form-item label="数据源" prop="dataSourceId" style="width: 600px">
          <el-select v-model="form.dataSourceId" placeholder="数据源" clearable @change="selectDataSource">
            <el-option v-for="ds in dataSourceList" :key="ds.id" :label="ds.name" :value="ds.id">
                <svg-icon  :icon-class="ds.icon" />
                <span style=" margin-left: 5px;">{{ ds.name }}</span> 
            </el-option>

          </el-select>
        </el-form-item>

        <el-form-item label="数据库" prop="databaseName" style="width: 600px">
          <el-select v-model="form.databaseName" placeholder="数据库" clearable>
            <el-option v-for="db in databaseList" :key="db" :label="db" :value="db"/>
          </el-select>
        </el-form-item>

        <div style="margin-bottom: 10px;">
            <span>SQL语句</span>
            <el-button type="primary" style="margin-left: 20px;" plain size="mini" @click="executeSQL">执 行</el-button>
        </div>

        <!-- 引入SQL代码在线编辑框组件 -->
        <sql-code ref="cm" :sql="sqlContent" :handleSQL="handleSQL"></sql-code>

        <el-tabs style="height:350px; overflow: auto;" v-model="activeName">
            <el-tab-pane label="执行结果" name="executeResult">
                <el-table :data="resultData" border >
                <el-table-column v-for="head in headList" :key="head.index" 
                  :prop="head.columnName" :label="head.columnName" align="center">
                </el-table-column>
              </el-table>
              <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                  @pagination="executeSQL"/>
            </el-tab-pane>
            <el-tab-pane label="执行日志" name="executeLog">
                <span>
                    {{sqlLog}}
                </span>
            </el-tab-pane>
        </el-tabs>  
    </el-form>
    <div style="margin-top: 10px;" >
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
    </div>

    
    
  </div>
</template>

<script>
import {getOpenDataSourceList} from '@/api/metadata/dataSource'
import {getFolderListByType} from '@/api/folder/folder'
import {executeSql, addSqlQuery, getSqlQueryDetail, updateSqlQuery} from '@/api/metadata/sqlQuery'
import sqlCode from './sqlCode.vue'
export default {
    // 新增或者编辑SQL query组件
    name:'SqlEditor',
    components: {
        sqlCode
    },
    data() {
        return {

            activeName: 'executeResult',
            id: undefined,
            title: '',
            form: {},
            dataSourceList: [],
            databaseList: [],
            folderList: [],
            sqlContent: '',
            total: 0,
            headList:[],
            resultData:[],
            sqlLog: '',
                   // 查询参数
            queryParams: {
            pageNo: 1,
            pageSize: 10,
            },
            rules:{
                name: [
                    { required: true, message: "名称不能为空", trigger: "blur" }
                ],
                folderId: [
                    { required: true, message: "数据库不能为空", trigger: "blur" }
                ],
                dataSourceId: [
                    { required: true, message: "数据源不能为空", trigger: "blur" }
                ],
                databaseName: [
                    { required: true, message: "数据库不能为空", trigger: "blur" }
                ],

            }
        }
    },

    created() {
        // 判断是新增还是修改
        this.id = this.$route.query.id
        if (this.id === undefined) {
            this.title = '新增SQL查询'
        } else {
            this.title = '修改SQL查询'
            getSqlQueryDetail(this.id).then(response => {
                this.form = response.data
                this.sqlContent = response.data.sqlContent
            })

        }
        // 获取数据源下拉
        getOpenDataSourceList().then(response => {
            this.dataSourceList = response.data
            this.dataSourceList.forEach(dataSource => {
                var icon = ''
                if (dataSource.type === 0) {
                icon = 'mysql'
                }
                if (dataSource.type === 1) {
                icon = 'clickHouse'
                }
                if (dataSource.type === 2) {
                icon = 'doris'
                }
                if (dataSource.type === 3) {
                icon = 'oracle'
                }
                dataSource.icon = icon
            })
        })

        // 获取分组下拉
        getFolderListByType(0).then(response => {
            this.folderList = response.data
        })
    },

    methods: {
        // 取消，回到SQL查询列表页
        cancel() {
            this.$router.push({ path: "/metadata/sqlQuery"});
        },

        submitForm() {
            // 保存 根据是否有id区别是新增还是修改
            this.$refs["form"].validate(valid => {
                if (valid) {
                    const params = {
                        ...this.form,
                        sqlContent: this.sqlContent,
                        id: this.id
                    }
                    if (this.id === undefined) {
                        addSqlQuery(params).then(response => {
                            this.$message({
                                type: "success",
                                message: '新增成功'
                            }) 
                            this.$router.push({ path: "/metadata/sqlQuery"});
                        }) 
                    } else {
                        updateSqlQuery(params).then(response => {
                            this.$message({
                                type: "success",
                                message: '修改成功'
                            }) 
                            this.$router.push({ path: "/metadata/sqlQuery"});
                        })


                    }
                    

                }
            })

        },
  
        // 选择数据源之后，根据数据源获取数据库下拉
        selectDataSource(value) {
            this.dataSourceList.forEach(dataSource => {
                if (dataSource.id === value) {
                    this.databaseList = dataSource.databaseList
                }
            })
        },

        // 执行SQL
        executeSQL() {
            const params = {
                ...this.form,
                ...this.queryParams,
                sqlContent: this.sqlContent,
            }
            executeSql(params).then(response => {
                const isSuccess = response.data.isSuccess
                this.sqlLog = response.data.sqlLog
                if (isSuccess) {
                    this.resultData = response.data.content
                    this.headList = response.data.head
                    this.activeName = 'executeResult'
                    this.total = response.data.total
                } else {
                    this.resultData = []
                    this.total = 0
                    this.activeName = 'executeLog'
                }

            })

        },

        // 提供处理SQL，供子组件使用，传递SQL语句
        handleSQL(content) {
            this.sqlContent = content
        }
    }

}
</script>

<style>

</style>