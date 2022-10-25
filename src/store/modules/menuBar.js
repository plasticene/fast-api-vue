/*
菜单栏数据
**/

const state = {
    isCollapse:false,
    tabsList: [
        {
            path: "/",
            name: "home",
            label: "首页",
            icon: "s-home",
            url: "Home/Home",
        }
    ], // 面包屑数据
    menuList:[
        {
            path:"/",
            name:"home",
            title:"首页",
            icon:"s-home"
        },
        {
            name:"metadata",
            title:"元数据",
            icon:"s-home",
            children:[
                {
                    path:"/dataSource",
                    name:"dataSource",
                    title:"数据源",
                    icon:"s-home" 
                },
                {
                    path:"/table",
                    name:"talble",
                    title:"表管理",
                    icon:"s-home" 
                },
                {
                    path:"/sqlEditor",
                    name:"sqlEditor",
                    title:"SQL编辑器",
                    icon:"s-home" 
                }
            ]
        },
        {
            name:"apiManange",
            title:"api管理",
            icon:"s-home",
            children:[
                {
                    path:"/apiHouse",
                    name:"apihouse",
                    title:"api库",
                    icon:"s-home" 
                },
                {
                    path:"/apiAuth",
                    name:"apiAuth",
                    title:"接口权限",
                    icon:"s-home" 
                },
                {
                    path:"/apiVisit",
                    name:"apiVist",
                    title:"访问记录",
                    icon:"s-home" 
                }
            ]
        },
        {
            name:"system",
            title:"系统管理",
            icon:"s-home",
            children:[
                {
                    path:"/user",
                    name:"user",
                    title:"用户管理",
                    icon:"s-home" 
                },
                {
                    path:"/role",
                    name:"role",
                    title:"角色管理",
                    icon:"s-home" 
                },
                {
                    path:"/menu",
                    name:"menu",
                    title:"菜单管理",
                    icon:"s-home" 
                },
                {
                    path:"/dept",
                    name:"dept",
                    title:"部门管理",
                    icon:"s-home" 
                },
            ]
        }
    ]
}

export default {
    // namespaced:true,
    state,
    
}