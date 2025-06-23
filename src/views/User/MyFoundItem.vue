<script lang="ts" setup>
import { Edit, Delete, InfoFilled } from '@element-plus/icons-vue'
import { myFoundItemsService, addFoundItemService, updateFoundItemService, deleteFoundItemService } from '@/api/FoundItem.js';
import { categoryNameService, categoryListService } from '@/api/Category.js';
import { ref, watch } from 'vue'
import { Plus, WarningFilled } from '@element-plus/icons-vue'
import { useTokenStore } from '@/stores/token.js';
import { ElMessage } from 'element-plus';
import { claimService } from '@/api/user';
import { Message } from '@element-plus/icons-vue';

const claimData = ref({
    claimerEmail: '',
    FoundID: 0
})
const claimDialogVisible = ref(false)

const showClaimDialog = (index) => {
    const selectedItem = FoundItems.value[index];
    if (!selectedItem) {
        ElMessage.error('无法获取物品详情');
        return;
    }
    claimData.value.FoundID = selectedItem.foundID;
    claimDialogVisible.value = true;
}

const claimItem = async () => {
    const result = await claimService(claimData.value);
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    ElMessage.success('认领成功');
    claimDialogVisible.value = false;
    myFoundItems()
}

const rules = {
    itemName: [
        { required: true, message: '请输入物品名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    categoryID: [
        { required: true, message: '请选择物品分类', trigger: 'blur' }
    ],
    location: [
        { required: true, message: '请输入丢失地点', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    foundTime: [
        { required: true, message: '请选择丢失时间', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入物品描述', trigger: 'blur' },
        { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
    ]
}
const dialogVisible_info = ref(false)
const dialogVisible_update = ref(false)
const tokenStore = useTokenStore();
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

const visibleDrawer = ref(false)
const FoundItems = ref([])
const date = ref('')
const time = ref('')
const categorys = ref([])
const FoundItemModel = ref({
    itemName: '',
    categoryID: '',
    location: '',
    foundTime: '',
    imageURL: '',
    description: ''
})

const disableFutureDate = (date) => {
    return date.getTime() > new Date().getTime(); // 禁用未来的日期
};

const disableFutureHours = () => {
    const now = new Date();
    const currentHour = now.getHours();

    // 如果选择的日期是今天，禁用当前时间之后的小时
    return date.value === now.toISOString().split('T')[0]
        ? Array.from({ length: 24 }, (_, i) => i).filter(hour => hour > currentHour)
        : [];
};

const disableFutureMinutes = (hour) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // 如果选择的是当前小时，禁用当前分钟之后的分钟
    return date.value === now.toISOString().split('T')[0] && hour === currentHour
        ? Array.from({ length: 60 }, (_, i) => i).filter(minute => minute > currentMinute)
        : [];
};

const uploadSuccess = (result: any) => {
    FoundItemModel.value.imageURL = result.data;
}

const myFoundItems = async () => {
    let result = await myFoundItemsService();
    const items = result.data;

    await Promise.all(items.map(async (item) => {
        const categoryResponse = await categoryNameService(item.categoryID);
        item.categoryName = categoryResponse.data;  // 将分类名称添加到物品对象中
    }));

    FoundItems.value = items;
}
const categoryList = async () => {
    let result = await categoryListService();
    categorys.value = result.data;
}

const addFoundItem = async () => {
    const result = await addFoundItemService(FoundItemModel.value);
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    ElMessage.success('发布成功');
    visibleDrawer.value = false;
    myFoundItems()
}

const updateFoundItem = async () => {
    const result = await updateFoundItemService(FoundItemModel.value);
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    ElMessage.success('更新成功');
    dialogVisible_update.value = false;
    myFoundItems()
}

const deleteFoundItem = async (foundID: number) => {
    const result = await deleteFoundItemService(foundID);
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    ElMessage.success('删除成功');
    myFoundItems();
}

const showDetails_info = (index) => {
    // 获取 FoundItems 中的对应项
    const selectedItem = FoundItems.value[index];
    if (!selectedItem) {
        ElMessage.error('无法获取物品详情');
        return;
    }

    // 赋值到 FoundItemModel
    FoundItemModel.value = { ...selectedItem };
    dialogVisible_info.value = true; // 打开对话框
};

const showDetails_update = (index) => {
    // 获取 FoundItems 中的对应项
    const selectedItem = FoundItems.value[index];
    if (!selectedItem) {
        ElMessage.error('无法获取物品详情');
        return;
    }

    // 赋值到 FoundItemModel
    FoundItemModel.value = { ...selectedItem };

    const foundTime = FoundItemModel.value.foundTime;
    if (foundTime) {
        const parsedDate = new Date(foundTime); // 将 foundTime 字符串转为 Date 对象

        // 提取日期部分（格式为 YYYY-MM-DD）
        const year = parsedDate.getFullYear();
        const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2); // 月份从0开始，所以加1
        const day = ('0' + parsedDate.getDate()).slice(-2);
        date.value = `${year}-${month}-${day}`; // 格式化为 YYYY-MM-DD

        // 提取时间部分（格式为 HH:mm）
        const hours = ('0' + parsedDate.getHours()).slice(-2);
        const minutes = ('0' + parsedDate.getMinutes()).slice(-2);
        time.value = `${hours}:${minutes}`; // 格式化为 HH:mm
    }

    dialogVisible_update.value = true; // 打开对话框
};

const getCategoryNameById = (categoryID: string) => {
    const category = categorys.value.find(c => c.categoryID === categoryID);
    return category.categoryName;
};

const clearFoundItemModel = () => {
    FoundItemModel.value = {
        itemName: '',
        categoryID: '',
        location: '',
        foundTime: '',
        imageURL: '',
        description: ''
    };
    date.value = '';
    time.value = '';
};

categoryList()
myFoundItems()

watch([date, time], ([newDate, newTime]) => {
    if (newDate && newTime) {
        // 将日期和时间拼接并格式化为 ISO 8601 格式
        const parsedDate = new Date(newDate); // 将日期字符串转为 Date 对象
        const [hours, minutes] = newTime.split(':'); // 从时间字符串提取小时和分钟
        parsedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0); // 设置时间部分

        parsedDate.setHours(parsedDate.getHours() + 8); // 手动加上 8 小时
        FoundItemModel.value.foundTime = parsedDate.toISOString().slice(0, 19);
    }

    const now = new Date();
    const selectedDateTime = new Date(`${newDate}T${newTime}:00`);
    if (selectedDateTime > now) {
        ElMessage.warning('选择的时间不能超过当前时间');
        time.value = ''; // 重置时间选择
    }
});

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <h3>我的失物招领</h3>
                <div class="extra">
                    <el-button type="warning" @click="visibleDrawer = true">发布失物招领</el-button>
                </div>
            </div>
        </template>
        <el-table :data="FoundItems" style="width: 100%; max-height: 60vh; overflow-y: auto;">
            <el-table-column label="物品图片">
                <template #default="{ row }">
                    <el-image :src="row.imageURL" style="width: 60px; height: 60px;" fit="cover"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="物品名" prop="itemName"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="找到地点" prop="location"></el-table-column>
            <el-table-column label="找到时间">
                <template #default="{ row }">
                    {{ formatDate(row.foundTime) }}
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status">
                <template #default="{ row }">
                    <!-- 根据状态显示不同内容 -->
                    <span v-if="row.status === 'reviewing'" style="color: orange;">审核中</span>
                    <span v-else-if="row.status === 'posted'" style="color: green;">已发布</span>
                    <span v-else-if="row.status === 'canceled'" style="color: red;">已取消</span>
                    <span v-else-if="row.status === 'claimed'" style="color: blue;">已认领</span>
                </template>
            </el-table-column>
            <el-table-column label="认领">
                <template #default="{ row, $index }">
                    <el-button v-if="row.status === 'posted'" type="success"
                        @click="showClaimDialog($index)">认领</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="{ row, $index }">
                    <el-button v-if="row.status !== 'claimed'" :icon="InfoFilled" circle plain type="info"
                        @click="showDetails_info($index)">
                    </el-button>
                    <el-button v-if="row.status !== 'claimed'" :icon="Edit" circle plain type="primary"
                        @click="showDetails_update($index)"></el-button>
                    <el-popconfirm v-if="row.status !== 'claimed'" title="确定删除？" confirm-button-text="确定"
                        confirm-button-type="danger" :icon="WarningFilled" cancel-button-text="取消"
                        @confirm="deleteFoundItem(row.foundID)">
                        <template #reference>
                            <el-button :icon="Delete" circle plain type="danger"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有失物招领" />
            </template>
        </el-table>
    </el-card>
    <!-- 添加失物招领 -->
    <el-drawer v-model="visibleDrawer" title="添加失物招领" direction="rtl" size="40%" @close="clearFoundItemModel">
        <el-form :model="FoundItemModel" label-width="100px" :rules="rules">
            <el-form-item label="物品名称" prop="itemName">
                <el-input v-model="FoundItemModel.itemName" placeholder="请输入物品名"></el-input>
            </el-form-item>
            <el-form-item label="物品分类" prop="categoryID">
                <el-select placeholder="请选择" v-model="FoundItemModel.categoryID">
                    <el-option v-for="c in categorys" :key="c.categoryID" :label="c.categoryName" :value="c.categoryID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="找到地点" prop="location">
                <el-input v-model="FoundItemModel.location" placeholder="请输入找到（大致位置）"></el-input>
            </el-form-item>
            <el-form-item label="找到时间">
                <el-date-picker v-model="date" style="width: 200px;" type="date" placeholder="选择日期"
                    :disabled-date="disableFutureDate" />
                <el-time-select v-model="time" style="width: 200px;" start="00:00" step="00:30" end="24:00"
                    placeholder="选择时间" :disabled-hours="disableFutureHours" :disabled-minutes="disableFutureMinutes" />
            </el-form-item>
            <el-form-item label="物品图片">
                <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="/api/foundItem/uploadImage" name="file" :headers="{ 'Authorization': tokenStore.token }"
                    :on-success="uploadSuccess">
                    <img v-if="FoundItemModel.imageURL" :src="FoundItemModel.imageURL" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="物品描述" prop="description">
                <el-input autosize maxlength="255" resize="none" show-word-limit type="textarea"
                    v-model="FoundItemModel.description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addFoundItem">发布</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
    <!-- 失物招领详情 -->
    <el-dialog v-model="dialogVisible_info" title="失物招领详情" width="30%">
        <el-form :model="FoundItemModel" label-width="100px" style="padding-right: 30px">
            <el-form-item label="物品名称：">
                <span>{{ FoundItemModel.itemName }}</span>
            </el-form-item>
            <el-form-item label="物品分类：">
                <span>{{ getCategoryNameById(FoundItemModel.categoryID) }}</span>
            </el-form-item>
            <el-form-item label="找到地点：">
                <span>{{ FoundItemModel.location }}</span>
            </el-form-item>
            <el-form-item label="找到时间：">
                <span>{{ formatDate(FoundItemModel.foundTime) }}</span>
            </el-form-item>
            <el-form-item label="描述：">
                <el-input autosize maxlength="255" resize="none" show-word-limit type="textarea"
                    v-model="FoundItemModel.description" readonly></el-input>
            </el-form-item>
            <el-form-item label="物品图片">
                <img :src="FoundItemModel.imageURL" style="max-width: 100%" class="avatar" />
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 修改失物招领 -->
    <el-dialog v-model="dialogVisible_update" title="修改失物招领" width="30%" @close="clearFoundItemModel">
        <el-form :model="FoundItemModel" label-width="100px" style="padding-right: 30px" :rules="rules">
            <el-form-item label="物品名称：" required prop="itemName">
                <el-input v-model="FoundItemModel.itemName"></el-input>
            </el-form-item>
            <el-form-item label="物品分类：" required prop="categoryID">
                <el-select placeholder="请选择" v-model="FoundItemModel.categoryID">
                    <el-option v-for="c in categorys" :key="c.categoryID" :label="c.categoryName" :value="c.categoryID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="找到地点：" required prop="location">
                <el-input v-model="FoundItemModel.location"></el-input>
            </el-form-item>
            <el-form-item label="找到时间：" required>
                <el-date-picker v-model="date" style="width: 200px;" type="date" placeholder="选择日期"
                    :disabled-date="disableFutureDate" />
                <el-time-select v-model="time" style="width: 200px;" start="00:00" step="00:30" end="24:00"
                    placeholder="选择时间" :disabled-hours="disableFutureHours" :disabled-minutes="disableFutureMinutes" />
            </el-form-item>
            <el-form-item label="描述：" required prop="description">
                <el-input autosize maxlength="255" resize="none" show-word-limit type="textarea"
                    v-model="FoundItemModel.description"></el-input>
            </el-form-item>
            <el-form-item label="物品图片">
                <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="/api/foundItem/uploadImage" name="file" :headers="{ 'Authorization': tokenStore.token }"
                    :on-success="uploadSuccess">
                    <img v-if="FoundItemModel.imageURL" style="width: 100%" :src="FoundItemModel.imageURL"
                        class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogVisible_update = false; clearFoundItemModel()">取消</el-button>
                <el-button type="primary"
                    @click="dialogVisible_update = false; updateFoundItem(); clearFoundItemModel()">
                    确认
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog title="请输入认领者邮箱" width="30%" v-model="claimDialogVisible" style="justify-content: center;">
        <el-input :prefix-icon="Message" style="width: 100%" placeholder="请输入认领者邮箱"
            v-model="claimData.claimerEmail"></el-input>
        <div style="display: flex; justify-content: center; margin-top: 10px;">
            <el-button type="primary"
                @click="claimItem(); claimDialogVisible = false; claimData.claimerEmail = ''; claimData.FoundID = 0;">确认</el-button>
        </div>
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

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
</style>