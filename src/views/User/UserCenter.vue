<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUserNameByTokenService } from '@/api/user';
import { useTokenStore } from '@/stores/token';
import { ElMessage } from 'element-plus';

const tokenStore = useTokenStore();
const router = useRouter()
const userName = ref('');
const getUser = async () => {
    const token = tokenStore.token;
    const res = await getUserNameByTokenService(token);
    if (res.code === 0) {
        userName.value = res.data;
    } else {
        ElMessage.error("请先登录");
        router.push('/login');
    }
};

const handleSelect = (key: string) => {
    router.push(key); // 跳转到对应路由
};

getUser();

</script>

<template>
    <el-container>
        <el-aside width="200px" class="aside">
            <el-menu active-text-color="#ffd04b" background-color="#545c64" class="aside-menu"
                default-active="/user/info" text-color="#fff" @Select="handleSelect" unique-opened="true">
                <el-menu-item index="/user/myFoundItem">我的失物招领</el-menu-item>
                <el-menu-item index="/user/myLostItem">我的寻物启事</el-menu-item>
                <el-menu-item index="/user/myMessage">我的留言</el-menu-item>

                <el-sub-menu index="4">
                    <template #title>
                        <span>个人信息</span>
                    </template>
                    <el-menu-item index="/user/info">详情信息</el-menu-item>
                    <el-menu-item index="/user/changePassword">修改密码</el-menu-item>
                    <el-menu-item index="/user/changeEmail">修改邮箱</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<style lang="scss" scoped>
.aside {
    height: calc(100vh - 80px);
    background-color: #555B63;

    .aside-menu {
        width: 100%;
    }
}
</style>