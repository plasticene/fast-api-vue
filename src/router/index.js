import VueRouter from "vue-router"
import AppMain from '@/layout/AppMain'
import Home from '@/views/dashboard/Home'
import DataSource from '@/views/metadata/DataSource'
import TableInfo from '@/views/metadata/TableInfo'
import SqlEditor from '@/views/metadata/SqlEditor'
import ApiHouse from '@/views/apiManage/ApiHouse'
import ApiAuth from '@/views/apiManage/ApiAuth'
import ApiVisit from '@/views/apiManage/ApiVisit'
import User from '@/views/system/User'
import Role from '@/views/system/Role'
import Menu from '@/views/system/Menu'
import Dept from '@/views/system/Dept'



export default new VueRouter({
    routes:[
        {
            path:'/',
            component:AppMain,
            redirect:'/home',
            children:[
                {path:'home', name:'home', component:Home},
                {path:'dataSource', name:'dataSource', component:DataSource},
                {path:'table', name:'table', component:TableInfo},
                {path:'sqlEditor', name:'sqlEditor', component:SqlEditor},

                {path:'apiHouse', name:'apiHouse', component:ApiHouse},
                {path:'apiAuth', name:'apiAuth', component:ApiAuth},
                {path:'apiVisit', name:'apiVisit', component:ApiVisit},

                {path:'user', name:'user', component:User},
                {path:'role', name:'role', component:Role},
                {path:'menu', name:'menu', component:Menu},
                {path:'dept', name:'dept', component:Dept},


            ]
        }
    ]
    
})