<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUserListService, banUserService, unbanUserService } from '@/api/admin';
import { ElMessage } from 'element-plus';
import { CircleCheckFilled, CircleCloseFilled, WarningFilled } from '@element-plus/icons-vue'
const router = useRouter();

const Users = ref([]);
const getUserList = async () => {
    try {
        const res = await getUserListService();
        if (res.code === 1) {
            ElMessage.error(res.message);
            return
        }
        Users.value = res.data;
    } catch (error) {
        ElMessage.error('请先以管理员身份登录')
        router.push('/adminLogin')
    }
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();  // 获取完整的年份
    const month = ('0' + (date.getMonth() + 1)).slice(-2);  // 月份从0开始，需要加1并格式化为两位
    const day = ('0' + date.getDate()).slice(-2);  // 格式化为两位
    const hours = ('0' + date.getHours()).slice(-2);  // 小时格式化为两位
    const minutes = ('0' + date.getMinutes()).slice(-2);  // 分钟格式化为两位
    const seconds = ('0' + date.getSeconds()).slice(-2);  // 秒格式化为两位
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;  // 返回格式化的字符串，包含年份
};

const banUser = async (userID: number) => {
    try {
        const res = await banUserService(userID);
        if (res.code === 1) {
            ElMessage.error(res.message);
            return
        }
        ElMessage.success('封禁成功');
        getUserList();
    } catch (error) {
        ElMessage.error('请先以管理员身份登录')
        router.push('/adminLogin')
    }
}

const unbanUser = async (userID: number) => {
    try {
        const res = await unbanUserService(userID);
        if (res.code === 1) {
            ElMessage.error(res.message);
            return
        }
        ElMessage.success('解封成功');
        getUserList();
    } catch (error) {
        ElMessage.error('请先以管理员身份登录')
        router.push('/adminLogin')
    }
}

getUserList();
</script>

<template>
    <el-main style="height: calc(100vh - 80px);">
        <el-card class="page-container">
            <template #header>
                <div class="header">
                    <h3>用户列表</h3>
                </div>
            </template>
            <el-table :data="Users" style="width: 100%; max-height: 68vh; overflow-y: auto;">
                <el-table-column label="用户ID" prop="userID" width="100"></el-table-column>
                <el-table-column label="用户名" prop="userName"></el-table-column>
                <el-table-column label="电话号码" prop="phone"></el-table-column>
                <el-table-column label="Email" prop="email"></el-table-column>
                <el-table-column label="信息更新时间" width="200">
                    <template #default="{ row }">
                        {{ formatDate(row.updatedAt) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template #default="{ row, $index }">
                        <el-button v-if="row.status === 'banned'" :icon="CircleCheckFilled" plain type="success"
                            @click="unbanUser(row.userID)">解封</el-button>
                        <el-popconfirm v-else title="确定封禁该用户？" confirm-button-text="确定" confirm-button-type="danger"
                            :icon="WarningFilled" cancel-button-text="取消" @confirm="banUser(row.userID)">
                            <template #reference>
                                <el-button :icon="CircleCloseFilled" plain type="danger">封禁</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有用户信息" />
                </template>
            </el-table>
        </el-card>
    </el-main>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
