<script lang="ts" setup>
import { Edit, Delete, WarningFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAnnouncementListService, addAnnouncementService, updateAnnouncementService, deleteAnnouncementService } from '@/api/Announcement';
import { ElMessage } from 'element-plus';
import { getAdminListService } from '@/api/admin';
const router = useRouter()
const adminList = ref([])
const AnnouncementModel = ref({
    title: '',
    content: '',
})

const getAdminList = async () => {
    try {
        const res = await getAdminListService()
        if (res.code === 1) {
            ElMessage.error(res.message)
            return
        }
        adminList.value = res.data
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

const dialogVisible_add = ref(false)
const dialogVisible_update = ref(false)

const Announcements = ref([])
const getAnnouncementList = async () => {
    try {
        const res = await getAnnouncementListService();
        if (res.code === 1) {
            ElMessage.error(res.message);
            return;
        }

        // 映射 adminName 到 Announcements
        Announcements.value = res.data.map(announcement => {
            const admin = adminList.value.find(admin => admin.adminID === announcement.adminID);
            return {
                ...announcement,
                adminName: admin ? admin.adminName : '未知管理员',
            };
        });
    } catch (error) {
        ElMessage.error('加载公告列表失败');
    }
};

const showDetails_update = (index) => {
    const selectedItem = Announcements.value[index];
    if (!selectedItem) {
        ElMessage.error('无法获取物品详情');
        return;
    }

    AnnouncementModel.value = { ...selectedItem };
    dialogVisible_update.value = true; // 打开对话框
};

const clearAnnouncementModel = () => {
    AnnouncementModel.value = {
        title: '',
        content: '',
    };
};

const addAnnouncement = async () => {
    try {
        const res = await addAnnouncementService(AnnouncementModel.value);
        if (res.code === 1) {
            ElMessage.error(res.message);
            return;
        }
        ElMessage.success('发布公告成功');
        dialogVisible_add.value = false;
        await getAnnouncementList();
    } catch (error) {
        ElMessage.error('发布公告失败');
    }
};

const deleteAnnouncement = async (announcementID) => {
    try {
        const res = await deleteAnnouncementService(announcementID);
        if (res.code === 1) {
            ElMessage.error(res.message);
            return;
        }
        ElMessage.success('删除公告成功');
        await getAnnouncementList();
    } catch (error) {
        ElMessage.error('删除公告失败');
    }
};

const updateAnnouncemtne = async () => {
    try {
        const res = await updateAnnouncementService(AnnouncementModel.value);
        if (res.code === 1) {
            ElMessage.error(res.message);
            return;
        }
        ElMessage.success('修改公告成功');
        dialogVisible_update.value = false;
        await getAnnouncementList();
    } catch (error) {
        ElMessage.error('修改公告失败');
    }
};

const loadData = async () => {
    await getAdminList();
    await getAnnouncementList();
};

loadData();


</script>

<template>
    <el-main style="height: calc(100vh - 80px);">
        <el-card class="page-container">
            <template #header>
                <div class="header">
                    <h3>公告列表</h3>
                    <div class="extra">
                        <el-button type="warning" @click="dialogVisible_add = true">发布公告</el-button>
                    </div>
                </div>
            </template>
            <el-table :data="Announcements" style="width: 100%; max-height: 68vh; overflow-y: auto;">
                <el-table-column label="发布管理员" prop="adminName" width="100"></el-table-column>
                <el-table-column label="公告标题" width="200" prop="title"></el-table-column>
                <el-table-column label="公告内容" prop="content"></el-table-column>
                <el-table-column label="发布时间" width="200">
                    <template #default="{ row }">
                        {{ formatDate(row.updatedAt) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template #default="{ row, $index }">
                        <el-button :icon="Edit" circle plain type="primary"
                            @click="showDetails_update($index)"></el-button>
                        <el-popconfirm title="确定删除？" confirm-button-text="确定" confirm-button-type="danger"
                            :icon="WarningFilled" cancel-button-text="取消"
                            @confirm="deleteAnnouncement(row.announcementID)">
                            <template #reference>
                                <el-button :icon="Delete" circle plain type="danger"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有公告" />
                </template>
            </el-table>
        </el-card>
    </el-main>
    <!-- 修改公告弹窗 -->
    <el-dialog v-model="dialogVisible_update" title="修改公告" width="30%" @close="clearAnnouncementModel">
        <el-form :model="AnnouncementModel" label-width="100px" style="padding-right: 30px">
            <el-form-item label="公告标题：" required>
                <el-input v-model="AnnouncementModel.title"></el-input>
            </el-form-item>
            <el-form-item label="公告内容：" required>
                <el-input autosize maxlength="255" resize="none" show-word-limit type="textarea"
                    v-model="AnnouncementModel.content"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogVisible_update = false; clearAnnouncementModel()">取消</el-button>
                <el-button type="primary" @click="updateAnnouncemtne(); loadData(); clearAnnouncementModel()">
                    确认
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 发布公告弹窗 -->
    <el-dialog v-model="dialogVisible_add" title="发布公告" width="30%" @close="clearAnnouncementModel">
        <el-form :model="AnnouncementModel" label-width="100px" style="padding-right: 30px">
            <el-form-item label="公告标题：" required>
                <el-input v-model="AnnouncementModel.title"></el-input>
            </el-form-item>
            <el-form-item label="公告内容：" required>
                <el-input autosize maxlength="255" resize="none" show-word-limit type="textarea"
                    v-model="AnnouncementModel.content"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogVisible_update = false; clearAnnouncementModel()">取消</el-button>
                <el-button type="primary" @click="addAnnouncement(); loadData(); clearAnnouncementModel()">
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
