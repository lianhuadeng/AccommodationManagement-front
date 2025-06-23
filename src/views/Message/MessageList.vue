<script lang="ts" setup>
import { ref } from 'vue'
import { searchMessageService } from '@/api/message';
import { ElMessage } from 'element-plus';
import { getUserNameByIdService } from '@/api/user';
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

const Messages = ref([])

//分页数据
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(100)

const onSizeChange = (size) => {
    pageSize.value = size;
    searchMessage();
}

const onCurrentChange = (page) => {
    pageNum.value = page;
    searchMessage();
}

const startTime = ref('')
const endTime = ref('')
const keyword = ref('')
const disableFutureDate = (date) => {
    return date.getTime() > new Date().getTime(); // 禁用未来的日期
};

const userNameMap = ref(new Map()); // 缓存用户名
// 获取用户名的方法
const getUserName = async (userID: number) => {
    if (!userNameMap.value.has(userID)) {
        const response = await getUserNameByIdService(userID); // 异步请求
        if (response.data) {
            userNameMap.value.set(userID, response.data); // 缓存结果
        } else {
            userNameMap.value.set(userID, "未知用户"); // 处理异常
        }
    }
    return userNameMap.value.get(userID);
};

// 预处理用户名
const processUserNames = async (items) => {
    for (const item of items) {
        await getUserName(item.userID); // 确保每个用户的用户名已加载到缓存
    }
};

const searchMessage = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyword: keyword.value ? keyword.value : null,
        startTime: startTime.value ? formatToLocalDateTime(startTime.value) : null,
        endTime: endTime.value ? formatToLocalDateTime(endTime.value) : null
    }
    const result = await searchMessageService(params);
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    Messages.value = result.data.items;
    total.value = result.data.total;
    await processUserNames(Messages.value);
}
searchMessage();
</script>

<template>
    <el-main>
        <el-form inline style="margin-top: 20px;" class="search-form">
            <el-form-item label="搜索关键字：">
                <el-input v-model="keyword" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item label="发布时间：">
                <el-date-picker v-model="startTime" type="datetime" placeholder="选择开始时间"
                    :disabled-date="disableFutureDate" />
                <span style="margin: 0 10px">到</span>
                <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间"
                    :disabled-date="disableFutureDate" />
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchMessage">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-card class="page-container">
            <template #header>
                <div class="header">
                    <h3>留言列表</h3>
                </div>
            </template>
            <el-table :data="Messages" style="width: 100%; max-height: 68vh; overflow-y: auto;">
                <el-table-column label="发布用户" width="100">
                    <template #default="{ row }">
                        {{ userNameMap.get(row.userID) }}
                    </template>
                </el-table-column>
                <el-table-column label="留言内容" width="900" prop="content"></el-table-column>
                <el-table-column label="发布时间">
                    <template #default="{ row }">
                        {{ formatDate(row.updatedAt) }}
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有留言" />
                </template>
            </el-table>
        </el-card>
        <el-pagination style="margin-top: 20px; justify-content: flex-end" background :hide-on-single-page="true"
            layout="total, prev, pager, next" v-model:current-page="pageNum" :total="total" v-model:page-size="pageSize"
            @size-change="onSizeChange" @current-change="onCurrentChange" />
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
