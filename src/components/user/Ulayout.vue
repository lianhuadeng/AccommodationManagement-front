<script  setup>
import { ref, onMounted, watch } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { useTokenStore } from '@/stores/token.js';
import {getUserInfo, getUserNameByTokenService, userLogoutService} from '@/api/user.js';
import { ElMessage } from 'element-plus';
const tokenStore = useTokenStore();

const router = useRouter()
const route = useRoute()

const stu = ref({
  name:'丘俊杰',
  id:'2022141460001',
  contact:'wx:mx11224qiu',
  location:'乐创园区翠竹楼6层628室3床',
  password:'123456'
})
stu.value.id = route.query.id

const activeIndex = ref('/index')
const handleSelect = (key) => {
    activeIndex.value = key; // 更新当前选中的菜单
    router.push({path:key,query:{id:stu.value.id}}); // 跳转到对应路由
};

const userName = ref("");
const getUserNameByToken = async (token) => {
    const result = await getUserNameByTokenService(token);
    if (result.code === 401) {
        userName.value = "";
        ElMessage.error("登录信息已过期，请重新登录");
        tokenStore.removeToken();
    }
    userName.value = result.data;
}

const logout = async () => {
    const token = tokenStore.token;
    await userLogoutService(token).then(() => {
        tokenStore.removeToken();
        location.reload();
    });
}

onMounted(() => {
    if (tokenStore.token) {
        getUserNameByToken(tokenStore.token);
    }

    // 初始设置 activeIndex
    activeIndex.value = router.currentRoute.value.path;
});

watch(
    () => router.currentRoute.value.path,
    (newPath) => {
        activeIndex.value = newPath; // 更新菜单的高亮状态
    }
);
</script>

<template>
    <el-container class="layout-container">
        <el-header class="header">
            <div class="logo"></div>
            <el-menu :default-active="activeIndex" class="menu" mode="horizontal" :ellipsis="false" text-color="#fff"
                active-text-color="#ffd04b" background-color="#AB3723" @select="handleSelect">
                <el-menu-item index="/user/index">个人中心</el-menu-item>
                <el-menu-item index="/user/room">房源检索</el-menu-item>
                <el-menu-item index="/user/change">宿舍调整</el-menu-item>
                <el-menu-item index="/user/repair">维修登记</el-menu-item>
                <el-menu-item index="/user/hygiene">卫生检查</el-menu-item>
                <el-menu-item index="/user/discipline">违纪检查</el-menu-item>
            </el-menu>
            <div class="header-buttons">
                <template v-if="userName">
                    <el-dropdown trigger="hover">
                        <el-link type="warning" :underline="true" @click="router.push('/user')">您好，{{ userName
                            }}</el-link>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
                <template v-else>
                    <el-button type="danger" plain class="login-btn" text bg
                        @click="router.push('/login')">登录</el-button>
                </template>
            </div>
        </el-header>
      <el-main>
        <router-view></router-view>

      </el-main>

        <div class="main">
        </div>

    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .header {
        height: 80px;
        background-color: #AB3723;
        display: flex;
        align-items: center;
        position: relative;

        .logo {
            width: 30vh;
            height: 7.5vh;
            background-image: url('/SCULogo.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin-left: 5%;
        }

        .header-buttons {
            margin-left: auto; // 将按钮容器推到右边
            display: flex;
            gap: 2vh; // 按钮之间的间距
            margin-right: 5vh; // 距离右边 5%
        }

        .menu {
            height: 100%;
            display: flex;
            justify-content: center;
            margin-left: 20vh; // 适当控制与 logo 的间距
        }
    }
}

</style>
