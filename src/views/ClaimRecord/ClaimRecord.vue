<script lang="ts" setup>
import { ref } from 'vue'
import { categoryListService } from '@/api/Category';
import { getClaimedFoundItemsService } from '@/api/FoundItem';
import { ElMessage } from 'element-plus';
import { getClaimerEmailByFoundIDService, getClaimerPhoneByFoundIDService, getClaimerNameByFoundIDService } from '@/api/ClaimRecord';
import { Message } from '@element-plus/icons-vue'
import { useTokenStore } from '@/stores/token';

const tokenStore = useTokenStore();

const formatToLocalDateTime = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; // 符合 LocalDateTime 格式
};

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
const disableFutureDate = (date) => {
    return date.getTime() > new Date().getTime(); // 禁用未来的日期
};

const claimerNameMap = ref(new Map());
const claimerPhoneMap = ref(new Map());
const claimerEmailMap = ref(new Map());

const getClaimerPhone = async (foundID) => {
    if (!claimerPhoneMap.value.has(foundID)) {
        try {
            const result = await getClaimerPhoneByFoundIDService(foundID);
            if (result.data) {
                claimerPhoneMap.value.set(foundID, result.data)
            } else {
                claimerPhoneMap.value.set(foundID, '该用户未设置手机号')
            }
        } catch (error) {
            claimerPhoneMap.value.set(foundID, '登录以获取手机号码')
        }
    }
    return claimerPhoneMap.value.get(foundID)
}
const processClaimerPhone = async (foundItems) => {
    for (const foundItem of foundItems) {
        await getClaimerPhone(foundItem.foundID)
    }
}

const getClaimerEmail = async (foundID) => {
    if (!claimerEmailMap.value.has(foundID)) {
        try {
            const result = await getClaimerEmailByFoundIDService(foundID);
            if (result.data) {
                claimerEmailMap.value.set(foundID, result.data)
            } else {
                claimerEmailMap.value.set(foundID, '该用户未设置邮箱')
            }
        } catch (error) {
            claimerEmailMap.value.set(foundID, '登录以获取邮箱')
        }
    }
    return claimerEmailMap.value.get(foundID)
}
const processClaimerEmail = async (foundItems) => {
    for (const foundItem of foundItems) {
        await getClaimerEmail(foundItem.foundID)
    }
}

const getClaimerName = async (foundID) => {
    if (!claimerNameMap.value.has(foundID)) {
        const result = await getClaimerNameByFoundIDService(foundID);
        if (result.data) {
            claimerNameMap.value.set(foundID, result.data)
        } else {
            claimerNameMap.value.set(foundID, '未知')
        }
    }
    return claimerNameMap.value.get(foundID)
}

const processClaimerName = async (foundItems) => {
    for (const foundItem of foundItems) {
        await getClaimerName(foundItem.foundID)
    }
}

const dialogVisible = ref(false)
const ContactModel = ref({
    phone: '',
    email: ''
})
const showContactDialog = (foundID) => {
    ContactModel.value.phone = ''
    ContactModel.value.email = ''
    getClaimerPhone(foundID).then(phone => {
        ContactModel.value.phone = phone
    })
    getClaimerEmail(foundID).then(email => {
        ContactModel.value.email = email
    })
    dialogVisible.value = true
}

//分页数据
const pageNum = ref(1)
const pageSize = ref(8)
const total = ref(100)

const onSizeChange = (size) => {
    pageSize.value = size
    getClaimedFoundItems()
}
const onCurrentChange = (page) => {
    pageNum.value = page
    getClaimedFoundItems()
}

const FoundItems = ref([])
const categoryID = ref('')
const categorys = ref([])
const keyword = ref('')
const location = ref('')
const startTime = ref('')
const endTime = ref('')
const categoryList = async () => {
    let result = await categoryListService();
    categorys.value = result.data;
}
categoryList()

const getClaimedFoundItems = async () => {
    const params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryID: categoryID.value ? categoryID.value : null,
        keyword: keyword.value ? keyword.value : null,
        location: location.value ? location.value : null,
        startTime: startTime.value ? formatToLocalDateTime(startTime.value) : null,
        endTime: endTime.value ? formatToLocalDateTime(endTime.value) : null
    }
    const result = await getClaimedFoundItemsService(params);
    if (result.code === 1) {
        ElMessage.error(result.message)
        return
    }
    FoundItems.value = result.data.items
    total.value = result.data.total

    for (let i = 0; i < FoundItems.value.length; i++) {
        let foundItem = FoundItems.value[i]
        for (let j = 0; j < categorys.value.length; j++) {
            if (foundItem.categoryID === categorys.value[j].categoryID) {
                foundItem.categoryName = categorys.value[j].categoryName
            }
        }
    }
    await processClaimerName(FoundItems.value)
    await processClaimerPhone(FoundItems.value)
    await processClaimerEmail(FoundItems.value)
}
const loadData = async () => {
    await getClaimedFoundItems();

};

loadData();
</script>

<template>
    <el-main>
        <el-form inline style="margin-top: 20px;" class="search-form">
            <el-form-item label="物品分类：">
                <el-select clearable style="width: 20vh" placeholder="请选择" v-model="categoryID">
                    <el-option v-for="c in categorys" :key="c.categoryID" :label="c.categoryName" :value="c.categoryID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="搜索关键字：">
                <el-input v-model="keyword" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item label="找到位置：">
                <el-input v-model="location" placeholder="请输入找到位置"></el-input>
            </el-form-item>
            <el-form-item label="找到时间：">
                <el-date-picker v-model="startTime" type="datetime" placeholder="选择开始时间"
                    :disabled-date="disableFutureDate" />
                <span style="margin: 0 10px">到</span>
                <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间"
                    :disabled-date="disableFutureDate" />
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="getClaimedFoundItems">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-card class="page-container">
            <template #header>
                <div class="header">
                    <h3>认领记录列表</h3>
                </div>
            </template>
            <el-table :data="FoundItems" style="width: 100%; max-height: 60vh; overflow-y: auto;">
                <el-table-column label="物品图片">
                    <template #default="{ row }">
                        <el-image :src="row.imageURL" style="width: 50px; height: 50px;" fit="cover"></el-image>
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
                <el-table-column label="认领者">
                    <template #default="{ row }">
                        {{ claimerNameMap.get(row.foundID) }}
                    </template>
                </el-table-column>
                <el-table-column label="联系方式">
                    <template #default="{ row }">
                        <el-button type="primary" :icon="Message" circle @click="showContactDialog(row.foundID)" />
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有对应认领记录" />
                </template>
            </el-table>
        </el-card>
        <el-pagination style="margin-top: 20px; justify-content: flex-end" background :hide-on-single-page="true"
            layout="total, prev, pager, next" v-model:current-page="pageNum" :total="total" v-model:page-size="pageSize"
            @size-change="onSizeChange" @current-change="onCurrentChange" />
    </el-main>
    <!-- 认领者联系方式弹窗 -->
    <el-dialog v-model="dialogVisible" title="联系方式" width="30%">
        <el-form :model="ContactModel" label-width="100px" style="padding-right: 30px">
            <el-form-item label="手机号码：">
                <span>{{ ContactModel.phone }}</span>
            </el-form-item>
            <el-form-item label="Email：">
                <span>{{ ContactModel.email }}</span>
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