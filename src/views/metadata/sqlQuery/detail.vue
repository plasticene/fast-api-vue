<template>
    <div class="app-container">
        <span style="margin-left: 5px; color: black;">SQL详情</span>
        <el-divider></el-divider>
        <el-form ref="form" :model="form"  label-width="80px" label-position="left" style="margin-left: 20px;" >
            <el-form-item label="名称:" prop="name"> {{ form.name }}</el-form-item>
            <el-form-item label="分组:" prop="folderName"> {{ form.folderName }}</el-form-item>
            <el-form-item label="数据源:" prop="dataSourceName"> {{ form.dataSourceName }}</el-form-item>
            <el-form-item label="数据库:" prop="databaseName"> {{ form.databaseName }}</el-form-item>
            <el-form-item label="SQL语句:" prop="sqlContent"> {{ form.sqlContent }}</el-form-item>
        </el-form>
        


    </div>
  
</template>

<script>
import {getSqlQueryDetail} from '@/api/metadata/sqlQuery'
export default {
    name: 'SqlDetail',
    data() {
        return {
            form: {
                name: undefined,
                folderName: undefined,
                dataSourceName: undefined,
                databaseName: undefined,
                sqlContent: undefined
            }
        }
    },

    created() {
        const id = this.$route.query.id
        getSqlQueryDetail(id).then(response => {
            this.form = response.data
        })
    }

}
</script>

<style>

</style>