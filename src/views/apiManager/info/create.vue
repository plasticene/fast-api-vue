<template>
    <div class="app-container">
        <h3 style="margin-top: 5px;"> {{title}} </h3>
        <el-divider></el-divider>
        <el-form inline ref="form" :model="form" :rules="rules" label-width="80px" label-position="left" style="margin-left: 20px;" >
            <el-form-item label="名称" prop="name" style="width: 600px">
                <el-input v-model="form.name" placeholder="请输入名称" style="width: 300px" />
            </el-form-item>

            <el-form-item label="路径" prop="path" style="width: 600px">
                <el-input placeholder="请输入路径" v-model="form.path">
                    <template slot="prepend">/fds/fapi/</template>
                </el-input>
            </el-form-item>

            <el-form-item label="接口类型" prop="type" style="width: 600px">
                <el-select v-model="form.type" placeholder="类型" clearable>
                    <el-option v-for="item in apiType" :key="item" :label="item.label" :value="item.value"/>
                </el-select>
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
    
            <el-tabs style="height:200px; overflow: auto;" v-model="activeName">
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
        <div>
            <el-table border :data="paramList">
                <el-table-column label="序号" align="center" type="index" />
                <el-table-column label="参数名称" align="center" prop="name">
                    <template slot-scope="scope">
                    <el-input v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="参数类型" align="center" prop="type">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.type" :options="paramType">
                            <el-option v-for="item in paramType" :key="item.value" :label="item.label"
                                        :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="是否必传" align="center" prop="required" width="100px">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.required" :options="requiredEnum">
                        <el-option v-for="item in requiredEnum" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="参数描述" align="center" prop="description">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.description"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 10px;" >
            <el-button type="primary" @click="submitForm">保 存</el-button>
            <el-button type="primary" @click="submitForm">冒 烟</el-button>
            <el-button type="primary" @click="submitForm">发 布</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>


        <!-- 添加或修改数据源对话框 -->
        <el-dialog title="添加参数" :visible.sync="open" width="500px" append-to-body>
            <el-input v-model="paramName" placeholder="请输入参数名" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addParam">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
  
      
      
    </div>
  </template>
  
  <script>
  import {getOpenDataSourceList} from '@/api/metadata/dataSource'
  import {getFolderListByType} from '@/api/folder/folder'
  import {executeSql, addSqlQuery, getSqlQueryDetail, updateSqlQuery} from '@/api/metadata/sqlQuery'
  import {addApiInfo, updateApi, somkeTest, releaseApi, offlineApi, getApiInfo} from '@/api/apiManager/apiInfo'
  import sqlCode from '@/views/metadata/sqlQuery/sqlCode.vue'
  export default {
      // 新增或者编辑SQL query组件
      name:'ApiCreate',
      components: {
          sqlCode
      },
      data() {
          return {
              open: false,
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
              paramList:[],
              paramName: undefined,
              sqlLog: '',
              paramType:[
                {label:'string', value: 'string'},
                {label:'number', value: 'number'},
                {label:'date', value: 'date'},
                {label:'array<string>', value: 'array<string>'},
                {label:'array<number>', value: 'array<number>'},
                {label:'array<date>', value: 'array<date>'},    
              ],
              requiredEnum: [
                {label: '是', value: true},
                {label: '否', value: false}
              ],
              apiType: [
                {label: 'get', value: 0},
                {label: 'post', value: 1}
              ],
            // 查询参数
              queryParams: {
              pageNo: 1,
              pageSize: 10,
              },
              rules:{
                  name: [
                      { required: true, message: "名称不能为空", trigger: "blur" }
                  ],
                  path: [
                      { required: true, message: "路径不能为空", trigger: "blur" }
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
              this.title = '新增API'
          } else {
              this.title = '修改API'
              getApiInfo(this.id).then(response => {
                  this.form = response.data
                  this.sqlContent = response.data.sqlContent
                  this.paramList = response.data.param
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
          getFolderListByType(1).then(response => {
              this.folderList = response.data
          })
      },
  
      methods: {
          // 取消
          cancel() {
            this.paramName = ''
            this.open = false
            
          },
  
          submitForm() {
              // 保存 根据是否有id区别是新增还是修改
              this.$refs["form"].validate(valid => {
                  if (valid) {
                      const params = {
                          ...this.form,
                          sqlContent: this.sqlContent,
                          id: this.id,
                          param: this.paramList
                      }
                      if (this.id === undefined) {
                          addApiInfo(params).then(response => {
                              this.$message({
                                  type: "success",
                                  message: '新增成功'
                              }) 
                              this.$router.push({ path: "/api/info"});
                          }) 
                      } else {
                          updateApi(params).then(response => {
                              this.$message({
                                  type: "success",
                                  message: '修改成功'
                              }) 
                              this.$router.push({ path: "/api/info"});
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
              const contentTemp = content
              if (contentTemp.endsWith("#{")) {
                this.open = true;
              }
          },

          addParam() {
            this.sqlContent = this.sqlContent + this.paramName + "}"
            this.open = false
            const param = {
                name: this.paramName,
                type: 'string',
                required: true,
                description: ''
            }
            this.paramList.push(param)
            this.paramName = ''
          }
      }
  
  }
  </script>
  
  <style>
  
  </style>