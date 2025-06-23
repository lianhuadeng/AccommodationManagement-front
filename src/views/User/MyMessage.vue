<script lang="ts" setup>
import { ref } from 'vue'
import { myMessagesService, addMessageService, updateMessageService, deleteMessageService } from '@/api/message';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { Delete, WarningFilled, Edit } from '@element-plus/icons-vue'
const router = useRouter();

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

const Messages = ref([]);
const getMyMessages = async () => {
    try {
        const res = await myMessagesService();
        if (res.code === 1) {
            ElMessage.error(res.message);
            return;
        }
        Messages.value = res.data;
    } catch (error) {
        ElMessage.error('请先登录')
        router.push('/login')
    }
}

const dialogVisible_add = ref(false);
const dialogVisible_update = ref(false);
const MessageModel = ref({
    messageID: 0,
    content: ''
});

const clearMessageModel = () => {
    MessageModel.value = {
        messageID: 0,
        content: ''
    }
}

const addMessage = async () => {
    try {
        const res = await addMessageService(MessageModel.value);
        if (res.code === 1) {
            ElMessage.error(res.message);
            return;
        }
        ElMessage.success('发布成功');
        dialogVisible_add.value = false;
        loadData();
    } catch (error) {
        ElMessage.error('请先登录')
        router.push('/login')
    }
}

const updateMessage = async () => {
    try {
        const res = await updateMessageService(MessageModel.value);
        if (res.code === 1) {
            ElMessage.error(res.message);
            return;
        }
        ElMessage.success('修改成功');
        dialogVisible_update.value = false;
        loadData();
    } catch (error) {
        ElMessage.error('请先登录')
        router.push('/login')
    }
}

const deleteMessage = async (messageID: number) => {
    try {
        const res = await deleteMessageService(messageID);
        if (res.code === 1) {
            ElMessage.error(res.message);
            return;
        }
        ElMessage.success('删除成功');
        loadData();
    } catch (error) {
        ElMessage.error('请先登录')
        router.push('/login')
    }
}

const showUpdateDialog = (messageID: number, content: string) => {
    MessageModel.value = {
        messageID,
        content
    }
    dialogVisible_update.value = true;
}

const loadData = async () => {
    await getMyMessages();
};

loadData();

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <h3>我的留言</h3>
                <div class="extra">
                    <el-button type="warning" @click="dialogVisible_add = true">发布留言</el-button>
                </div>
            </div>
        </template>
        <el-table :data="Messages" style="width: 100%; max-height: 60vh; overflow-y: auto;">
            <el-table-column label="留言内容" prop="content"></el-table-column>
            <el-table-column label="发布时间">
                <template #default="{ row }">
                    {{ formatDate(row.updatedAt) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row, $index }">
                    <el-button :icon="Edit" circle plain type="primary"
                        @click="showUpdateDialog(row.messageID, row.content)"></el-button>
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
    <!-- 修改留言弹窗 -->
    <el-dialog v-model="dialogVisible_update" title="修改留言" width="30%" @close="clearMessageModel">
        <el-form :model="MessageModel" label-width="100px" style="padding-right: 30px">
            <el-form-item label="留言内容：" required>
                <el-input autosize maxlength="255" resize="none" show-word-limit type="textarea"
                    v-model="MessageModel.content"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogVisible_update = false; clearMessageModel()">取消</el-button>
                <el-button type="primary" @click="updateMessage(); loadData(); clearMessageModel()">
                    确认
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 发布留言弹窗 -->
    <el-dialog v-model="dialogVisible_add" title="发布留言" width="30%" @close="clearMessageModel">
        <el-form :model="MessageModel" label-width="100px" style="padding-right: 30px">
            <el-form-item label="留言内容：" required>
                <el-input autosize maxlength="255" resize="none" show-word-limit type="textarea"
                    v-model="MessageModel.content"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogVisible_update = false; clearMessageModel()">取消</el-button>
                <el-button type="primary" @click="addMessage(); loadData(); clearMessageModel()">
                    确认
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
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
