<template>
  <div class="components-container">
    <div>
      <h2>表信息</h2>
    </div>
    <split-pane split="vertical" :min-percent='15' :default-percent='25' @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-tree
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @click="handleNodeClick"
              @node-expand="handleNodeClick"
              ref="tree">
              <span slot-scope="{ node, data}" class="span__">
                  <svg-icon v-if="data.icon" :icon-class="data.icon" />
                  <span style="margin-left: 2px;"> {{ node.label }}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
      </template>
      <template slot="paneR">
        <div v-show="selectTable" class="right-container">
          <div><h3>{{table.name}}  {{table.comment}}</h3></div>
          <el-tabs v-model="activeTabName" @tab-click="selectTab" >
            <el-tab-pane label="表结构" name="tableStruct">
              <el-table :data="tableStruct" border >
                <el-table-column prop="index" label="序号" align="center" />
                <el-table-column prop="columnName" label="字段名" align="center" />
                <el-table-column prop="columnType" label="类型" align="center" />
                <el-table-column prop="columnComment" label="注释" align="center" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="表数据" name="tableData">
              <el-table :data="tableData" border >
                <el-table-column v-for="head in tableLabel" :key="head.index" 
                  :prop="head.columnName" :label="head.columnName" align="center">
                </el-table-column>
              </el-table>
              <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                  @pagination="hanldeTabData"/>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-show="!selectTable" class="empty-info">请点击左侧菜单选择数据库表</div>

      </template>
    </split-pane>
    
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import {getOpenDataSourceList} from '@/api/metadata/dataSource'
import {getTableList, getTableStruct, getTableData} from '@/api/metadata/tableInfo'
export default {
    name:'TableInfo',
    components: {
      splitPane
    },
    data() {
      return {
        filterText: '',
        total: 0,
        selectTable: false,
        activeTabName: 'tableData',
        tableStruct:[],
        tableData:[],
        tableLabel:[],
        table:{
          name: '',
          comment: '',
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
           // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          tableName: undefined,
          databaseName: undefined,
          dataSourceId: undefined
        },
      }
    },

    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    created() {
      this.getList()
    },

    methods: {
      resize() {
        console.log('resize')
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },

      getList() {
        getOpenDataSourceList().then(response => {
          const dataSourceList = response.data

          dataSourceList.forEach(val => {
            const databaseList = val.databaseList
            const database = []
            databaseList.forEach(name => {
              const ds = {
                id: undefined,
                dataSourceId: val.id,
                label: name,
                icon: 'database',
                children:[{}]
              }
              database.push(ds)
            })
            var icon = ''
            if (val.type === 0) {
              icon = 'mysql'
            }
            if (val.type === 1) {
              icon = 'clickHouse'
            }
            if (val.type === 2) {
              icon = 'doris'
            }
            if (val.type === 3) {
              icon = 'oracle'
            }
            const dataSource = {
              id: val.id,
              label: val.name,
              icon: icon,
              children: database
            }
            this.treeData.push(dataSource)
          })
          console.log("treeData", this.treeData)

        });
      },

      handleNodeClick(data, node, vc) {
        if (!node.expanded && !node.isLeaf) {
          return
        }
        if (data.dataSourceId !== undefined && !data.isLeaf) {
          // 说明点击的是数据库，此时根据数据源id和数据库获取该库下的表
          const params = {
            dataSourceId: data.dataSourceId,
            databaseName: data.label
          }
          getTableList(params).then(response => {
            const tableList = response.data
            if (tableList !== undefined) {
              const tables = []
              tableList.forEach(table => {
                const t = {
                  id: undefined,
                  label: table.tableName,
                  icon:'table',
                  isLeaf: true,
                  dataSourceId: data.dataSourceId,
                  databaseName: data.label,
                  comment: table.tableComment
                }
                tables.push(t)
              })
              data.children = tables
            }
          })
        }

        if (data.isLeaf) {
          // 说明此时点击是表，这时候需要获取表结构或者表数据
          this.selectTable = true
          this.table.name= data.label
          this.table.comment = data.comment
          this.queryParams.dataSourceId = data.dataSourceId
          this.queryParams.databaseName = data.databaseName
          this.queryParams.tableName = data.label
          this.hanldeTabData()
        }  
      },

      hanldeTabData() {
        if (this.activeTabName === 'tableStruct') {
            const simpleParam = {
              ...this.queryParams
            }
            delete simpleParam.pageNo
            delete simpleParam.pageSize
            getTableStruct(simpleParam).then(response => {
              this.tableStruct = response.data
            })
          }
          if (this.activeTabName == 'tableData') {
            getTableData(this.queryParams).then(response => {
              this.tableData = response.data.content
              this.tableLabel = response.data.head
              this.total = response.data.total
            })
          }
      },

      selectTab(tab, event) {
          this.activeTabName = tab.name;
          this.hanldeTabData()
      }

      
  }

}
</script>

<style  scoped>
  .components-container {
    position: relative;
    height: 100vh;
    margin-left: 10px;
  }

  .left-container {
    /* background-color: #F38181; */
    height: 100%;
    width: 100%;
    overflow: auto;
  }

  .right-container {
    /* background-color: #F38181; */
    width: 90%;
    height: 90%;
    margin-left: 20px;
    overflow: auto;
  }

  .empty-info{
  position: absolute;
  top: 46%;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  letter-spacing: 2px;
  /* background-color: #f5f5f5; */
}

</style>
