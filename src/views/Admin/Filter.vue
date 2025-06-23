<script lang="ts" setup>
import { ref } from 'vue';
import {
    getFilterFoundItemService, getFilterLostItemService, sendEmailRemindAllFoundItemService,
    sendEmailRemindAllLostItemService, sendEmailRemindFoundItemService, sendEmailRemindLostItemService,
    deleteFoundItemService, deleteLostItemService
} from '@/api/admin';
import { categoryListService } from '@/api/Category';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

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


const sendEmailRemindFoundItem = async (foundID) => {
    const result = await sendEmailRemindFoundItemService(foundID);
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    ElMessage.success('邮件已发送');
};

const sendEmailRemindLostItem = async (lostID) => {
    const result = await sendEmailRemindLostItemService(lostID);
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    ElMessage.success('邮件已发送');
};

const sendEmailRemindAllFoundItem = async () => {
    const result = await sendEmailRemindAllFoundItemService();
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    ElMessage.success('邮件已发送');
};

const sendEmailRemindAllLostItem = async () => {
    const result = await sendEmailRemindAllLostItemService();
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    ElMessage.success('邮件已发送');
};

const deleteFoundItem = async (foundID) => {
    const result = await deleteFoundItemService(foundID);
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    ElMessage.success('删除成功');
    getFoundItemList();
};

const deleteLostItem = async (lostID) => {
    const result = await deleteLostItemService(lostID);
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    ElMessage.success('删除成功');
    getLostItemList();
};

const router = useRouter();

const FoundItemList = ref([]);
const LostItemList = ref([]);
const showFoundTable = ref(true);

const categorys = ref([])
const categoryList = async () => {
    let result = await categoryListService();
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    categorys.value = result.data;
}

const getFoundItemList = async () => {
    try {
        const result = await getFilterFoundItemService();
        if (result.code === 0) {
            FoundItemList.value = result.data.map(item => {
                const category = categorys.value.find(c => c.categoryID === item.categoryID);

                // 计算间隔时间
                const updatedDate = new Date(item.updatedAt);
                const currentDate = new Date();
                const timeDifference = Math.abs(currentDate.getTime() - updatedDate.getTime());
                const intervalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

                return {
                    ...item,
                    categoryName: category ? category.categoryName : '未分类',
                    intervalDays // 添加间隔天数
                };
            });
        }
    } catch (error) {
        ElMessage.error('请先登录');
        router.push('/adminLogin');
    }
};


const getLostItemList = async () => {
    const res = await getFilterLostItemService();
    if (res.code === 0) {
        LostItemList.value = res.data.map(item => {
            const category = categorys.value.find(c => c.categoryID === item.categoryID);

            // 计算间隔时间
            const updatedDate = new Date(item.updatedAt);
            const currentDate = new Date();
            const timeDifference = Math.abs(currentDate.getTime() - updatedDate.getTime());
            const intervalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            return {
                ...item,
                categoryName: category ? category.categoryName : '未分类',
                intervalDays
            };
        });
    }
};

categoryList().then(() => {
    getFoundItemList();
    getLostItemList();
});

</script>

<template>
    <el-main style="height: calc(100vh - 80px);">
        <el-card v-if="showFoundTable" class="table">
            <template #header>
                <div class="header">
                    <h3>失物招领列表</h3>
                    <div class="extra">
                        <el-button type="success" plain @click="sendEmailRemindAllFoundItem">一键提醒</el-button>
                        <el-button type="warning" @click="showFoundTable = false">寻物启事</el-button>
                    </div>
                </div>
            </template>
            <el-table :data="FoundItemList" style="width: 100%; max-height: 100%; overflow-y: auto;">
                <el-table-column label="物品图片">
                    <template #default="{ row }">
                        <el-image :src="row.imageURL" style="width: 50px; height: 50px;" fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="物品名" prop="itemName"></el-table-column>
                <el-table-column label="分类" prop="categoryName"></el-table-column>
                <el-table-column label="找到地点" prop="location"></el-table-column>
                <el-table-column label="描述" width="500" prop="description"></el-table-column>
                <el-table-column label="发布时间">
                    <template #default="{ row }">
                        {{ formatDate(row.updatedAt) }}
                    </template>
                </el-table-column>
                <el-table-column label="间隔时间">
                    <template #default="{ row }">
                        <span v-if="row.intervalDays <= 60" style="color: blue;">{{ row.intervalDays }} 天</span>
                        <span v-else-if="row.intervalDays <= 90" style="color: #EDE355;">{{ row.intervalDays }} 天</span>
                        <span v-else-if="row.intervalDays <= 120" style="color: #E08D39">{{ row.intervalDays }} 天</span>
                        <span v-else style="color: red;">{{ row.intervalDays }} 天</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="{ row, $index }">
                        <el-button type="success" plain @click="sendEmailRemindFoundItem(row.foundID)">邮件提醒</el-button>
                        <el-button type="danger" plain @click="deleteFoundItem(row.foundID)">删除</el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有对应失物招领" />
                </template>
            </el-table>
        </el-card>
        <el-card v-else class="table">
            <template #header>
                <div class="header">
                    <h3>寻物启事列表</h3>
                    <div class="extra">
                        <el-button type="success" plain @click="sendEmailRemindAllLostItem">一键提醒</el-button>
                        <el-button type="warning" @click="showFoundTable = true">失物招领</el-button>
                    </div>
                </div>
            </template>
            <el-table :data="LostItemList" style="width: 100%; max-height: 100%; overflow-y: auto;">
                <el-table-column label="物品图片">
                    <template #default="{ row }">
                        <el-image :src="row.imageURL" style="width: 50px; height: 50px;" fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="物品名" prop="itemName"></el-table-column>
                <el-table-column label="分类" prop="categoryName"></el-table-column>
                <el-table-column label="丢失地点" prop="location"></el-table-column>
                <el-table-column label="描述" width="500" prop="description"></el-table-column>
                <el-table-column label="发布时间">
                    <template #default="{ row }">
                        {{ formatDate(row.updatedAt) }}
                    </template>
                </el-table-column>
                <el-table-column label="间隔时间">
                    <template #default="{ row }">
                        <span v-if="row.intervalDays <= 60" style="color: blue;">{{ row.intervalDays }} 天</span>
                        <span v-else-if="row.intervalDays <= 90" style="color: #EDE355;">{{ row.intervalDays }} 天</span>
                        <span v-else-if="row.intervalDays <= 120" style="color: #E08D39">{{ row.intervalDays }} 天</span>
                        <span v-else style="color: red;">{{ row.intervalDays }} 天</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="{ row, $index }">
                        <el-button type="success" plain @click="sendEmailRemindLostItem(row.lostID)">邮件提醒</el-button>
                        <el-button type="danger" plain @click="deleteLostItem(row.lostID)">删除</el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有对应寻物启事" />
                </template>
            </el-table>
        </el-card>
    </el-main>
</template>

<style lang="scss" scoped>
.table {
    border-radius: 10px;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
