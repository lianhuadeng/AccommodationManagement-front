import {createRouter, createWebHistory} from 'vue-router'

import LoginVue from '@/views/Login.vue'
import UIndex from "@/components/user/UIndex.vue";
import Ulayout from "@/components/user/Ulayout.vue";
import Room from "@/components/user/Room.vue";
import Discipline from "@/components/user/Discipline.vue";
import Hygiene from "@/components/user/Hygiene.vue";
import Repair from "@/components/user/Repair.vue";
import Change from "@/components/user/Change.vue";
import RegDiscipline from "@/components/Dormitory/RegDiscipline.vue";
import AllocateMain from "@/components/Dormitory/AllocateMain.vue";
import HygieneCheck from "@/components/Dormitory/HygieneCheck.vue";
import RoomExert from "@/components/Dormitory/RoomExert.vue";
import Dlayout from "@/components/Dormitory/Dlayout.vue";
import DIndex from "@/components/Dormitory/DIndex.vue";
import MIndex from "@/components/Maintenance/MIndex.vue";
import Mlayout from "@/components/Maintenance/Mlayout.vue";
import MainExert from "@/components/Maintenance/MainExert.vue";
import Llayout from "@/components/Leader/Llayout.vue";
import LIndex from "@/components/Leader/LIndex.vue";
import Audit from "@/components/Leader/Audit.vue";
import DispCheck from "@/components/Leader/DispCheck.vue";
import Slayout from "@/components/system/Slayout.vue";
import SIndex from "@/components/system/SIndex.vue";
import EditUser from "@/components/system/EditUser.vue";
import EditRoom from "@/components/system/EditRoom.vue";

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
            {path: '/user/repair',component: Repair}
        ]
    },
    {
        path: '/leader',
        redirect: '/leader/index',
        component: Llayout,
        children:[
            {path: '/leader/index',component: LIndex},
            {path: '/leader/audit',component: Audit},
            {path: '/leader/check',component: DispCheck},
        ]
    },
    {
        path: '/dormitory',
        redirect: '/dormitory/index',
        component: Dlayout,
        children:[
            {path: '/dormitory/index',component: DIndex},
            {path: '/dormitory/exert',component: RoomExert},
            {path: '/dormitory/check',component: HygieneCheck},
            {path: '/dormitory/discipline',component: RegDiscipline},
            {path: '/dormitory/allocate',component: AllocateMain},
        ]
    },
    {
        path: '/maintenance',
        redirect: 'maintenance/index',
        component: Mlayout,
        children:[
            {path: '/maintenance/index',component: MIndex},
            {path: '/maintenance/exert',component: MainExert},
        ]
    },
    {
        path: '/system',
        redirect: '/system/index',
        component: Slayout,
        children:[
            {path: '/system/index',component: SIndex},
            {path: '/system/editUser',component: EditUser},
            {path:'/system/editRoom',component: EditRoom}
        ]
    },
]

//创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//导出路由实例
export default router