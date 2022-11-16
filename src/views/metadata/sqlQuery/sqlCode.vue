<template>
    <div>
      <codemirror v-model="sqlContent" ref="codemirror" class="myMirror"  :options="cmOptions" @ready="onCmReady" 
                  @inputRead="onCmCodeChange" @input="inputChange" >
      </codemirror>
    </div>
  </template>
  
  <script>
  import {codemirror} from 'vue-codemirror'
  
  import 'codemirror/theme/solarized.css'
  import 'codemirror/theme/idea.css'
  import 'codemirror/theme/darcula.css'
  import "codemirror/addon/hint/show-hint.css";
  import 'codemirror/mode/sql/sql.js'
  
  require("codemirror/lib/codemirror");
  require("codemirror/mode/sql/sql");
  require("codemirror/addon/hint/show-hint");
  require("codemirror/addon/hint/sql-hint");
  
  export default {
    // SQL 代码在线编辑器组件
    name: "sqlCode",
    components: {
      codemirror
    },
    data() {
      return {
        sqlContent: '',
        cmInstance: null, // 当前codemirror实例
        cmOptions: {
          value: '',
          styleActiveLine: true,
          lineNumbers: true,
          mode: 'text/x-mysql',
          theme: 'idea',
          lint: true,                     // 代码出错提醒
          matchBrackets: true,
          theme: 'idea',
          extraKeys: {"Tab": "autocomplete"},  //Tab可以弹出选择项
          hintOptions: { // 自定义提示选项
            completeSingle: false, // 当匹配只有一项的时候是否自动补全
            tables: {}
          }
        },
  
  
      }
    },
    // props: ['sql', 'mode', 'tableHits', 'handleSQL'],
    // 属性，通过父组件引用该组件时候，传递数据值
    props: {
      sql: {
        type: String,
        default: ''
      },
      mode: {
        type: String,
        default: 'mini'
      },
      tableHints:{
        type: Object,
  
      },
      handleSQL:{
        type: Function
      }
    },
    methods: {
      // 注意该方法会在父组件的created()钩子之前执行，所以在我们编辑SQL查询，SQL语句是通过created()方法掉后端获取的，
      // 但是这时候已经不能渲染到该组件的文本框了，只能通过v-model动态绑定了
      onCmReady(cm) {
        // console.log('cm', cm)
        cm.setValue(this.sql)
        // debugger
        this.cmList.push(cm)
        if (this.mode === "mini")
          cm.setSize('100%', '400px')
        else {
          cm.setSize('100%', 'calc(100vh - 350px)')
        }
        // console.log('the editor is readied!', cm)
      },

      onCmFocus(cm) {
      },

      onCmCodeChange(cm, changeObj) {
        //如果输入的是字母才提示，空格不提示
        if (/^[a-zA-Z.]/.test(changeObj.text[0])) {
          cm.showHint()
        }
      },

      inputChange(content) {
        this.$nextTick(() => {
            // 调用父组件把SQL语句传递过去
            this.handleSQL(content)
            
        });
      }
    },
    watch: {
      mode(val, oldVal) {
        if (val === "mini")
          this.cmInstance.setSize('100%', '400px')
        else {
          this.cmInstance.setSize('100%', 'calc(100vh - 350px)')
        }
      },
      tableHints(val,OldVal){
        this.cmOptions.hintOptions.tables = val
      },

      // 监视sql属性，赋值给sqlContent,动态绑定
      sql(val, oldVal) {
        this.sqlContent = val
      }
    },
    created() {
      this.cmOptions.hintOptions.tables = this.tableHints
    }
  }
  </script>
  
  <style scoped lang="scss">
  .myMirror {
    width: 100%;
    
    // .CodeMirror-line {
    //   font-family: 'Consolas', Helvetica, Arial, sans-serif !important;
    //   font-size: 18px !important;
    //   line-height: 20px;
  
    // .cm-comment {
    //     font-family: 'Consolas', Helvetica, Arial, sans-serif !important;
    //     font-size: 18px !important;
    //     line-height: 20px;
    //   }
    // }
  }
  </style>