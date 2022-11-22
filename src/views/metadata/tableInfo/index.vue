<template>
  <div class="components-container">
    <div>
      <h2>表信息</h2>
    </div>
    <split-pane split="vertical" :min-percent="15" :default-percent="25" @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
          />
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-tree
              ref="tree"
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
              @node-expand="handleNodeClick"
            >
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
          <div><h3>{{ table.name }}  {{ table.comment }}</h3></div>
          <el-tabs v-model="activeTabName" @tab-click="selectTab">
            <el-tab-pane label="表结构" name="tableStruct">
              <el-table :data="tableStruct" border>
                <el-table-column prop="index" label="序号" align="center" />
                <el-table-column prop="columnName" label="字段名" align="center" />
                <el-table-column prop="columnType" label="类型" align="center" />
                <el-table-column prop="columnComment" label="注释" align="center" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="表数据" name="tableData">
              <el-table :data="tableData" border>
                <el-table-column
                  v-for="head in tableLabel"
                  :key="head.index"
                  :prop="head.columnName"
                  :label="head.columnName"
                  align="center"
                />
              </el-table>
              <pagination
                v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNo"
                :limit.sync="queryParams.pageSize"
                @pagination="hanldeTabData"
              />
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
import { getOpenDataSourceList } from '@/api/metadata/dataSource'
import { getTableList, getTableStruct, getTableData } from '@/api/metadata/tableInfo'
export default {
  name: 'TableInfo',
  components: {
    splitPane
  },
  data() {
    return {
      // 树搜索
      filterText: '',
      // 表数据查询总页数
      total: 0,
      // 是否点击了数据源树结构下表，点击之后需要展示右侧界面
      selectTable: false,
      // 表数据和表结构tab页切换
      activeTabName: 'tableStruct',
      // 表结构
      tableStruct: [],
      // 表数据
      tableData: [],
      // 表标签栏，因为每个表的字段不一样，所以表格的label是动态变化的
      tableLabel: [],
      // 表名和注释，用于点击表之后，在右侧布局中展示
      table: {
        name: '',
        comment: ''
      },
      // 左侧数据源目录树结果
      treeData: [],
      // 树结构定义
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
      }
    }
  },

  // 监视树搜索变量值，实时搜索
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  created() {
    this.getList()
  },

  methods: {
    resize() {

    },

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    getList() {
      // 调接口获取左侧数据源目录树，并按定义构造这颗tree
      // 数据源名称一级  其下面的数据库二级，数据库下的表三级
      // 注意：这里只能获取到数据源和下面的数据库，表只能在点击数据库之后调接口获取表，因为后端没办法在多数据源多数据库一下
      //      一次性返回所有表
      getOpenDataSourceList().then(response => {
        const dataSourceList = response.data
        dataSourceList.forEach(val => {
          const databaseList = val.databaseList
          const database = []
          // 拿到数据源下的数据库，构建tree的二级结构
          databaseList.forEach(name => {
            const ds = {
              id: undefined,
              // 这里放入数据源id，方便点击数据库掉接口获取下面的表时候传递数据源id
              dataSourceId: val.id,
              label: name,
              icon: 'database',
              // 指定数据库有一个默认的空孩子，不然数据库级左侧展开箭头没有，不知道这么实现是否合理？？？
              children: [{}]
            }
            database.push(ds)
          })
          // 根据数据源类型匹配对应的svg图标，这么写感觉不太优雅？？？？
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
          // 一个数据源和数据源下数据库构造出tree一个节点
          const dataSource = {
            id: val.id,
            label: val.name,
            icon: icon,
            children: database
          }
          this.treeData.push(dataSource)
        })
      })
    },

    // 处理树点击逻辑，这里点击数据库时候会掉两次接口，因为触发了node-click和node-expand事件，还没有解决这个问题。。。
    handleNodeClick(data, node, vc) {
      // 如果是收缩或者该节点不是叶子节点，就不做任何处理
      if (!node.expanded && !node.isLeaf) {
        return
      }
      // 如果数据源id不为空，且不是叶子节点，说明点击的是数据库，此时根据数据源id和数据库获取该库下的表
      if (data.dataSourceId !== undefined && !data.isLeaf) {
        const params = {
          dataSourceId: data.dataSourceId,
          databaseName: data.label
        }
        // 调接口获取数据库下的表，并放到tree结构下面
        getTableList(params).then(response => {
          const tableList = response.data
          if (tableList !== undefined) {
            const tables = []
            // 构建当前表目录节点，也就是最下级
            tableList.forEach(table => {
              const t = {
                id: undefined,
                label: table.tableName,
                icon: 'table',
                isLeaf: true,
                dataSourceId: data.dataSourceId,
                databaseName: data.label,
                comment: table.tableComment
              }
              tables.push(t)
            })
            // 当前data就是数据库级，直接把上面的表层级做data孩子即可
            data.children = tables
          }
        })
      }

      // 说明此时点击是表，这时候需要获取表结构或者表数据
      if (data.isLeaf) {
        this.selectTable = true
        this.table.name = data.label
        this.table.comment = data.comment
        this.queryParams.dataSourceId = data.dataSourceId
        this.queryParams.databaseName = data.databaseName
        this.queryParams.tableName = data.label
        this.hanldeTabData()
      }
    },

    // 处理右侧布局tab的数据
    hanldeTabData() {
      // 查询表结构
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
      // 查询表数据
      if (this.activeTabName == 'tableData') {
        getTableData(this.queryParams).then(response => {
          this.tableData = response.data.content
          // 动态表头
          this.tableLabel = response.data.head
          this.total = response.data.total
        })
      }
    },

    // 切换tab页再次掉接口, 我看别人的没有掉，这里不掉接口切换之后就没有数据。。。。。
    selectTab(tab, event) {
      this.activeTabName = tab.name
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
