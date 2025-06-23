import {createRouter, createWebHistory} from 'vue-router'

import LoginVue from '@/views/Login.vue'
import LeaderCenter from "@/views/Leader/LeaderCenter.vue";
import DormitoryCenter from "@/views/Dormitory/DormitoryCenter.vue";
import SystemCenter from "@/views/System/SystemCenter.vue";
import MaintenanceCenter from "@/views/Maintenance/MaintenanceCenter.vue";
import UIndex from "@/components/user/UIndex.vue";
import Ulayout from "@/components/user/Ulayout.vue";
import Room from "@/components/user/Room.vue";
import Discipline from "@/components/user/Discipline.vue";
import Hygiene from "@/components/user/Hygiene.vue";
import Repair from "@/components/user/Repair.vue";
import Change from "@/components/user/Change.vue";

//定义路由关系
const routes = [
    {
        path: '/login',
        component: LoginVue
    },
    {
        path: '/',
        redirect: '/login',
        component: LoginVue
    },
    {
        path: '/user',
        redirect: '/user/index',
        component: Ulayout,
        children:[
            {path: '/user/index',component: UIndex},
            {path: '/user/room',component: Room},
            {path: '/user/change',component: Change},
            {path: '/user/discipline',component: Discipline},
            {path: '/user/hygiene',component: Hygiene},
            {path: '/user/repair',component: Repair},

        ]
    },
    {
        path: '/leader',
        component: LeaderCenter
    },
    {
        path: '/dormitory',
        component: DormitoryCenter
    },
    {
        path: '/maintenance',
        component: MaintenanceCenter
    },
    {
        path: '/system',
        component: SystemCenter
    },
]

//创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//导出路由实例
export default router