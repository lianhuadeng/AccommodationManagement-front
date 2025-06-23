<script lang="ts" setup>
import { ref } from 'vue'
import { Delete, WarningFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { getMessageListService, deleteMessageService, getUserListService } from '@/api/admin';
import { ElMessage } from 'element-plus';
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

const Messages = ref([]);
const getMessageList = async () => {
    try {
        const res = await getMessageListService();
        if (res.code === 1) {
            ElMessage.error(res.message)
            return;
        }
        Messages.value = res.data.map(message => {
            const user = Users.value.find(user => user.userID === message.userID);
            return {
                ...message,
                userName: user ? user.userName : '未知用户',
            };
        });
    } catch (error) {
        ElMessage.error('请先以管理员身份登录')
        router.push('/adminLogin')
    }
}

const deleteMessage = async (messageID: number) => {
    try {
        const res = await deleteMessageService(messageID);
        if (res.code === 1) {
            ElMessage.error(res.message)
            return;
        }
        ElMessage.success('删除成功')
        await getMessageList();
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

const loadData = async () => {
    await getUserList();
    await getMessageList();
};

loadData();

</script>

<template>
    <el-main style="height: calc(100vh - 80px);">
        <el-card class="page-container">
            <template #header>
                <div class="header">
                    <h3>留言列表</h3>
                </div>
            </template>
            <el-table :data="Messages" style="width: 100%; max-height: 68vh; overflow-y: auto;">
                <el-table-column label="发布用户" prop="userName" width="100"></el-table-column>
                <el-table-column label="留言内容" width="900" prop="content"></el-table-column>
                <el-table-column label="发布时间">
                    <template #default="{ row }">
                        {{ formatDate(row.updatedAt) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template #default="{ row, $index }">
                        <el-popconfirm title="确定删除？" confirm-button-text="确定" confirm-button-type="danger"
                            :icon="WarningFilled" cancel-button-text="取消" @confirm="deleteMessage(row.messageID)">
                            <template #reference>
                                <el-button :icon="Delete" circle plain type="danger"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有留言" />
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
