<script lang="ts" setup>
import { ref } from 'vue';
import { getFoundItemListService, getLostItemListService, approveFoundItemService, approveLostItemService, rejectFoundItemService, rejectLostItemService } from '@/api/admin';
import { categoryListService } from '@/api/Category';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const reviewData = ref({
    foundID: '',
    lostID: '',
    reason: ''
});

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


const currentActive = ref("reviewing")

const categorys = ref([])
const categoryList = async () => {
    let result = await categoryListService();
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    categorys.value = result.data;
}

const rejectReasonDialogVisible = ref(false);
const showFoundTable = ref(true);
const FoundItems = ref([]);
const LostItems = ref([]);

const FoundItemList = ref([]);
const LostItemList = ref([]);

const getFoundItemList = async () => {
    try {
        const res = await getFoundItemListService();
        if (res.code === 0) {
            FoundItemList.value = res.data.map(item => {
                const category = categorys.value.find(c => c.categoryID === item.categoryID);
                return {
                    ...item,
                    categoryName: category ? category.categoryName : '未分类'
                };
            });
            updatePercentages();
        }
    } catch (error) {
        ElMessage.error('请先登录');
        router.push('/adminLogin')
    }
};

const getLostItemList = async () => {
    const res = await getLostItemListService();
    if (res.code === 0) {
        LostItemList.value = res.data.map(item => {
            const category = categorys.value.find(c => c.categoryID === item.categoryID);
            return {
                ...item,
                categoryName: category ? category.categoryName : '未分类'
            };
        });
        updatePercentages();
    }
};


const showReviewingFound = () => {
    showFoundTable.value = true;
    FoundItems.value = [];
    LostItems.value = [];
    for (let i = 0; i < FoundItemList.value.length; i++) {
        if (FoundItemList.value[i].status === 'reviewing') {
            FoundItems.value.push(FoundItemList.value[i]);
        }
    }
    currentActive.value = "reviewing"
};

const showPostedFound = () => {
    showFoundTable.value = true;
    FoundItems.value = [];
    LostItems.value = [];
    for (let i = 0; i < FoundItemList.value.length; i++) {
        if (FoundItemList.value[i].status === 'posted') {
            FoundItems.value.push(FoundItemList.value[i]);
        }
    }
    currentActive.value = "posted"
};

const showCanceledFound = () => {
    showFoundTable.value = true;
    FoundItems.value = [];
    LostItems.value = [];
    for (let i = 0; i < FoundItemList.value.length; i++) {
        if (FoundItemList.value[i].status === 'canceled') {
            FoundItems.value.push(FoundItemList.value[i]);
        }
    }
    currentActive.value = "canceled"
};

const showReviewingLost = () => {
    showFoundTable.value = false;
    FoundItems.value = [];
    LostItems.value = [];
    for (let i = 0; i < LostItemList.value.length; i++) {
        if (LostItemList.value[i].status === 'reviewing') {
            LostItems.value.push(LostItemList.value[i]);
        }
    }
    currentActive.value = "reviewing"
};

const showPostedLost = () => {
    showFoundTable.value = false;
    FoundItems.value = [];
    LostItems.value = [];
    for (let i = 0; i < LostItemList.value.length; i++) {
        if (LostItemList.value[i].status === 'posted') {
            LostItems.value.push(LostItemList.value[i]);
        }
    }
    currentActive.value = "posted"
};

const showCanceledLost = () => {
    showFoundTable.value = false;
    FoundItems.value = [];
    LostItems.value = [];
    for (let i = 0; i < LostItemList.value.length; i++) {
        if (LostItemList.value[i].status === 'canceled') {
            LostItems.value.push(LostItemList.value[i]);
        }
    }
    currentActive.value = "canceled"
};

const calculatePercentage = (list, status) => {
    if (list.length === 0) return 0; // 防止除以 0
    const count = list.filter(item => item.status === status).length;
    return Math.round((count / list.length) * 100); // 计算百分比并四舍五入
};

// 定义用于存储各状态百分比的变量
const reviewingFoundPercentage = ref(0);
const postedFoundPercentage = ref(0);
const canceledFoundPercentage = ref(0);

const reviewingLostPercentage = ref(0);
const postedLostPercentage = ref(0);
const canceledLostPercentage = ref(0);

// 更新进度条的计算逻辑
const updatePercentages = () => {
    // Found items
    reviewingFoundPercentage.value = calculatePercentage(FoundItemList.value, 'reviewing');
    postedFoundPercentage.value = calculatePercentage(FoundItemList.value, 'posted');
    canceledFoundPercentage.value = calculatePercentage(FoundItemList.value, 'canceled');

    // Lost items
    reviewingLostPercentage.value = calculatePercentage(LostItemList.value, 'reviewing');
    postedLostPercentage.value = calculatePercentage(LostItemList.value, 'posted');
    canceledLostPercentage.value = calculatePercentage(LostItemList.value, 'canceled');
};

const showRejectReasonDialog_found = (index: number) => {
    reviewData.value.foundID = FoundItems.value[index].foundID;
    reviewData.value.reason = '';
    rejectReasonDialogVisible.value = true;
};

const showRejectReasonDialog_lost = (index: number) => {
    reviewData.value.lostID = LostItems.value[index].lostID;
    reviewData.value.reason = '';
    rejectReasonDialogVisible.value = true;
};

const approveFoundItem = async (foundID: number) => {
    const res = await approveFoundItemService(foundID);
    if (res.code === 0) {
        ElMessage.success('审核通过');
        await getFoundItemList(); // 重新获取数据
        updateTable(); // 更新表格
    } else {
        ElMessage.error(res.message);
    }
};

const approveLostItem = async (lostID: number) => {
    const res = await approveLostItemService(lostID);
    if (res.code === 0) {
        ElMessage.success('审核完成');
        await getLostItemList(); // 重新获取数据
        updateTable(); // 更新表格
    } else {
        ElMessage.error(res.message);
    }
};

const rejectFoundItem = async () => {
    const res = await rejectFoundItemService(reviewData.value);
    if (res.code === 0) {
        ElMessage.success('审核完成');
        await getFoundItemList(); // 重新获取数据
        updateTable(); // 更新表格
    } else {
        ElMessage.error(res.message);
    }
};

const rejectLostItem = async () => {
    const res = await rejectLostItemService(reviewData.value);
    if (res.code === 0) {
        ElMessage.success('审核完成');
        await getLostItemList(); // 重新获取数据
        updateTable(); // 更新表格
    } else {
        ElMessage.error(res.message);
    }
};

const handelConfirm = () => {
    if (showFoundTable.value) {
        rejectFoundItem();
    } else {
        rejectLostItem();
    }
    rejectReasonDialogVisible.value = false;
};

const updateTable = () => {
    if (currentActive.value === "reviewing") {
        if (showFoundTable.value) {
            showReviewingFound(); // 更新表格为待审核项
        } else {
            showReviewingLost(); // 更新表格为待审核项
        }
    } else if (currentActive.value === "posted") {
        if (showFoundTable.value) {
            showPostedFound(); // 更新表格为已发布项
        } else {
            showPostedLost(); // 更新表格为已发布项
        }
    } else if (currentActive.value === "canceled") {
        if (showFoundTable.value) {
            showCanceledFound(); // 更新表格为已取消项
        } else {
            showCanceledLost(); // 更新表格为已取消项
        }
    }
};

categoryList().then(() => {
    getFoundItemList().then(() => {
        showReviewingFound(); // 默认显示待审核失物招领数据
    });
    getLostItemList(); // 同时加载寻物启事数据，供后续切换使用
});

</script>

<template>
    <el-main>
        <el-container class="progress">
            <el-container class="lostItem-progress">
                <el-header class="lostHeader">
                    <div class="lostLogo"></div>
                    <span class="lostTitle_1">寻物启事</span>
                    <span class="lostTitle_2">Lost Items</span>
                </el-header>
                <el-main class="lostProgress">
                    <el-progress type="circle" :percentage="reviewingLostPercentage" status="warning"
                        @click="showReviewingLost()">待审核</el-progress>
                    <el-progress type="circle" :percentage="postedLostPercentage" status="success"
                        @click="showPostedLost()">审核通过</el-progress>
                    <el-progress type="circle" :percentage="canceledLostPercentage" status="exception"
                        @click="showCanceledLost()">审核不通过</el-progress>
                </el-main>
            </el-container>
            <el-container class="foundItem-progress">
                <el-header class="foundHeader">
                    <div class="foundLogo"></div>
                    <span class="foundTitle_1">失物招领</span>
                    <span class="foundTitle_2">Found Items</span>
                </el-header>
                <el-main class="foundProgress">
                    <el-progress type="circle" :percentage="reviewingFoundPercentage" status="warning"
                        @click="showReviewingFound()">待审核</el-progress>
                    <el-progress type="circle" :percentage="postedFoundPercentage" status="success"
                        @click="showPostedFound()">审核通过</el-progress>
                    <el-progress type="circle" :percentage="canceledFoundPercentage" status="exception"
                        @click="showCanceledFound()">审核不通过</el-progress>
                </el-main>
            </el-container>
        </el-container>
        <el-card v-if="showFoundTable" class="table">
            <el-table :data="FoundItems" style="width: 100%; max-height: 48vh; overflow-y: auto;">
                <el-table-column label="物品图片">
                    <template #default="{ row }">
                        <el-image :src="row.imageURL" style="width: 100px; height: 100px;" fit="cover"></el-image>
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
                <el-table-column label="描述" width="500" prop="description"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="{ row, $index }">
                        <el-button v-if="currentActive === 'reviewing' || currentActive === 'canceled'" type="success"
                            plain @click="approveFoundItem(row.foundID)">通过</el-button>
                        <el-button v-if="currentActive === 'reviewing' || currentActive === 'posted'" type="danger"
                            plain @click="showRejectReasonDialog_found($index)">不通过</el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有对应失物招领" />
                </template>
            </el-table>
        </el-card>
        <el-card v-else class="table">
            <el-table :data="LostItems" style="width: 100%; max-height: 48vh; overflow-y: auto;">
                <el-table-column label="物品图片">
                    <template #default="{ row }">
                        <el-image :src="row.imageURL" style="width: 100px; height: 100px;" fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="物品名" prop="itemName"></el-table-column>
                <el-table-column label="分类" prop="categoryName"></el-table-column>
                <el-table-column label="丢失地点" prop="location"></el-table-column>
                <el-table-column label="丢失时间">
                    <template #default="{ row }">
                        {{ formatDate(row.lostTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="描述" width="500" prop="description"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="{ row, $index }">
                        <el-button v-if="currentActive === 'reviewing' || currentActive === 'canceled'" type="success"
                            plain @click="approveLostItem(row.lostID)">通过</el-button>
                        <el-button v-if="currentActive === 'reviewing' || currentActive === 'posted'" type="danger"
                            plain @click="showRejectReasonDialog_lost($index)">不通过</el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有对应寻物启事" />
                </template>
            </el-table>
        </el-card>
        <el-dialog title="原因" width="30%" v-model="rejectReasonDialogVisible" style="justify-content: center;">
            <el-input autosize maxlength="255" resize="none" show-word-limit type="textarea" style="width: 100%"
                placeholder="请输入拒绝原因" v-model="reviewData.reason"></el-input>
            <div style="display: flex; justify-content: center; margin-top: 10px;">
                <el-button type="primary" @click="handelConfirm()">确认</el-button>
            </div>
        </el-dialog>
    </el-main>
</template>

<style lang="scss" scoped>
.progress {
    display: flex;
    justify-content: space-between;
    gap: 20px;

    .lostItem-progress,
    .foundItem-progress {
        width: 45%;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

        .lostHeader,
        .foundHeader {
            display: flex;
            align-items: center;
            height: 10vh;

            .lostLogo {
                width: 30px;
                height: 30px;
                background-image: url('/public/LostLogo.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                margin-right: 10px; // 图标与标题之间的间距
            }

            .foundLogo {
                width: 30px;
                height: 30px;
                background-image: url('/public/FoundLogo.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                margin-right: 10px; // 图标与标题之间的间距
            }

            .lostTitle_1,
            .foundTitle_1 {
                font-weight: bold;
                font-size: 16px;
                margin-right: 10px; // 与副标题的间距
            }

            .lostTitle_2,
            .foundTitle_2 {
                color: #bfbfbf; // 浅灰色
                font-size: 14px;
                margin-right: 10px; // 与“更多”链接的间距
            }
        }

        .foundProgress,
        .lostProgress {
            display: flex;
            justify-content: center;
            align-items: center;

            .el-progress {
                margin-right: 20px;
                width: 10vw;
            }
        }
    }
}

.table {
    margin-top: 20px;
    border-radius: 10px;
}
</style>
