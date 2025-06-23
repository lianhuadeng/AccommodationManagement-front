import { createRouter, createWebHistory } from 'vue-router'

import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import IndexVue from '@/views/Index.vue'
import LostItemList from '@/views/LostItem/LostItemList.vue'
import FoundItemList from '@/views/FoundItem/FoundItemList.vue'
import MessageList from '@/views/Message/MessageList.vue'
import UserCenter from '@/views/User/UserCenter.vue'

import UserInfo from '@/views/User/Info.vue'
import MyFoundItem from '@/views/User/MyFoundItem.vue'
import MyLostItem from '@/views/User/MyLostItem.vue'
import MyMessage from '@/views/User/MyMessage.vue'
import ChangePassword from '@/views/User/ChangePassword.vue'
import ChangeEmail from '@/views/User/ChangeEmail.vue'
import AdminCenter from '@/views/Admin/AdminCenter.vue'
import ReviewManage from '@/views/Admin/ReviewManage.vue'
import UserManage from '@/views/Admin/UserManage.vue'
import MessageManage from '@/views/Admin/MessageManage.vue'
import AnnouncementManage from '@/views/Admin/AnnouncementManage.vue'
import ClaimRecord from '@/views/ClaimRecord/ClaimRecord.vue'
import Filter from '@/views/Admin/Filter.vue'
//定义路由关系
const routes = [
    {
        path: '/login',
        component: LoginVue
    },
    {
        path: '/',
        component: LayoutVue,
        redirect: '/index',
        children: [
            {
                path: 'index',
                component: IndexVue
            },
            {
                path: 'foundItem/list',
                component: FoundItemList
            },
            {
                path: 'lostItem/list',
                component: LostItemList
            },
            {
                path: 'user',
                component: UserCenter,
                redirect: '/user/info', // 默认重定向到 /user/info
                children: [
                    {
                        path: 'info',
                        component: UserInfo
                    },
                    {
                        path: 'myFoundItem',
                        component: MyFoundItem
                    },
                    {
                        path: 'myLostItem',
                        component: MyLostItem
                    },
                    {
                        path: 'myMessage',
                        component: MyMessage
                    },
                    {
                        path: 'changePassword',
                        component: ChangePassword
                    },
                    {
                        path: 'changeEmail',
                        component: ChangeEmail
                    }
                ]
            },
            {
                path: 'message/list',
                component: MessageList
            },
            {
                path: 'claimRecord',
                component: ClaimRecord
            }

        ]
    },

    {
        path: '/admin',
        component: AdminCenter,
        redirect: '/admin/reviewManage',
        children: [
            {
                path: 'reviewManage',
                component: ReviewManage
            },
            {
                path: 'userManage',
                component: UserManage
            },
            {
                path: 'messageManage',
                component: MessageManage
            },
            {
                path: 'announcementManage',
                component: AnnouncementManage
            },
            {
                path: 'filter',
                component: Filter
            }
        ]
    }      ]

//创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//导出路由实例
export default router