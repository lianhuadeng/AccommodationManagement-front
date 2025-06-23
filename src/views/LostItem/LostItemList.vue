<script lang="ts" setup>
import { categoryListService } from '@/api/Category.js';
import { ref } from 'vue'
import { lostItemListService } from '@/api/LostItem.js';
import { ElMessage } from 'element-plus';
import { getUserNameByIdService, getUserContactService, getUserEmailService } from '@/api/user.js';
import { useTokenStore } from '@/stores/token.js';

const tokenStore = useTokenStore();

const userNameMap = ref(new Map());
const userContactMap = ref(new Map());
const userEmailMap = ref(new Map());

// 弹窗相关
const dialogVisible = ref(false)
const dialogItem = ref();
const showDialog = (item) => {
    dialogItem.value = item; // 将点击的lostItem赋值给dialogItem
    dialogVisible.value = true; // 打开dialog
};

const getUserEmail = async (userID: number) => {
    if (!userEmailMap.value.has(userID)) {
        try {
            const response = await getUserEmailService(userID); // 异步请求
            if (response.data) {
                userEmailMap.value.set(userID, response.data); // 缓存结果
            } else {
                userEmailMap.value.set(userID, "未知邮箱"); // 处理异常
            }
        } catch (error) {
            userEmailMap.value.set(userID, "登录以获取邮箱"); // 处理异常
        }
    }
    return userEmailMap.value.get(userID);
};

const processUserEmail = async (items) => {
    for (const item of items) {
        await getUserEmail(item.userID); // 确保每个用户的邮箱已加载到缓存
    }
};

const getUserContact = async (userID: number) => {
    if (!userContactMap.value.has(userID)) {
        try {
            const response = await getUserContactService(userID);
            if (response.data) {
                userContactMap.value.set(userID, response.data);
            } else {
                userContactMap.value.set(userID, "用户未设置电话号码");
            }
        } catch (error) {
            userContactMap.value.set(userID, "登录以获取手机号码");
        }
    }
    return userContactMap.value.get(userID);
};

const processUserContact = async (items) => {
    for (const item of items) {
        await getUserContact(item.userID); // 确保每个用户的联系方式已加载到缓存
    }
};

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

const disableFutureDate = (date) => {
    return date.getTime() > new Date().getTime(); // 禁用未来的日期
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
//分页数据
const pageNum = ref(1)
const pageSize = ref(8)
const total = ref(100)

const onSizeChange = (size) => {
    pageSize.value = size;
    lostItemList();
}

const onCurrentChange = (page) => {
    pageNum.value = page;
    lostItemList();
}

const LostItems = ref([])
const categorys = ref([])
const startTime = ref('')
const endTime = ref('')
const categoryID = ref('')
const keyword = ref('')
const location = ref('')

const categoryList = async () => {
    let result = await categoryListService();
    categorys.value = result.data;
}
categoryList()

//获取寻物启事列表
const lostItemList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryID: categoryID.value ? categoryID.value : null,
        keyword: keyword.value ? keyword.value : null,
        location: location.value ? location.value : null,
        startTime: startTime.value ? formatToLocalDateTime(startTime.value) : null,
        endTime: endTime.value ? formatToLocalDateTime(endTime.value) : null
    }
    let result = await lostItemListService(params);
    if (result.code === 1) {
        ElMessage.error(result.message);
        return;
    }
    LostItems.value = result.data.items;
    total.value = result.data.total;

    for (let i = 0; i < LostItems.value.length; i++) {
        let lostItem = LostItems.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (lostItem.categoryID === categorys.value[j].categoryID) {
                lostItem.categoryName = categorys.value[j].categoryName;
            }
        }
    }

    await processUserNames(LostItems.value);
    await processUserContact(LostItems.value);
    await processUserEmail(LostItems.value);
}

lostItemList()

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
            <el-form-item label="丢失位置：">
                <el-input v-model="location" placeholder="请输入丢失位置"></el-input>
            </el-form-item>
            <el-form-item label="丢失时间：">
                <el-date-picker v-model="startTime" type="datetime" placeholder="选择开始时间"
                    :disabled-date="disableFutureDate" />
                <span style="margin: 0 10px">到</span>
                <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间"
                    :disabled-date="disableFutureDate" />
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="lostItemList">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-container class="lost-item-container">
            <el-card v-for="item in LostItems" :key="item.lostID" style="max-width: 23vw" class="lost-item-card">
                <template #header>
                    {{ item.itemName }}
                </template>
                <img :src="item.imageURL" alt="图片" style="width: 100%" @click="showDialog(item)" />
                <el-collapse>
                    <el-collapse-item :title="'发布人：' + userNameMap.get(item.userID)" name="1">
                        <div>描述: {{ item.description }}</div>
                        <div>位置: {{ item.location }}</div>
                        <div>丢失时间: {{ formatDate(item.lostTime) }}</div>
                    </el-collapse-item>
                </el-collapse>
                <div @click="showDialog(item)">发布时间: {{ formatDate(item.updatedAt) }}</div>
            </el-card>
        </el-container>
        <el-pagination style="margin-top: 20px; justify-content: flex-end" background :hide-on-single-page="true"
            layout="total, prev, pager, next" v-model:current-page="pageNum" :total="total" v-model:page-size="pageSize"
            @size-change="onSizeChange" @current-change="onCurrentChange" />
        <el-dialog v-model="dialogVisible" title="详情" width="30%">
            <el-form label-width="100px" style="padding-right: 30px">
                <el-form-item label="物品名称：">
                    <span>{{ dialogItem?.itemName }}</span>
                </el-form-item>
                <el-form-item label="物品分类：">
                    <span>{{ dialogItem?.categoryName }}</span>
                </el-form-item>
                <el-form-item label="丢失地点：">
                    <span>{{ dialogItem?.location }}</span>
                </el-form-item>
                <el-form-item label="丢失时间：">
                    <span>{{ formatDate(dialogItem?.lostTime) }}</span>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input :value="dialogItem?.description" autosize maxlength="255" resize="none" show-word-limit
                        readonly></el-input>
                </el-form-item>
                <el-form-item label="物品图片">
                    <img :src="dialogItem?.imageURL" style="width: 100%" class="avatar" />
                </el-form-item>
                <el-form-item label="发布时间：">
                    <span>{{ formatDate(dialogItem?.updatedAt) }}</span>
                </el-form-item>
                <el-form-item label="发布人：">
                    <span>{{ userNameMap.get(dialogItem?.userID) }}</span>
                </el-form-item>
                <el-form-item label="联系方式：">
                    <span>
                        电话号码:&nbsp;&nbsp;&nbsp;{{ userContactMap.get(dialogItem?.userID) }}
                        <br>
                        Email:&nbsp;&nbsp;&nbsp;{{ userEmailMap.get(dialogItem?.userID) }}
                    </span>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-main>
</template>

<style lang="scss" scoped>
.lost-item-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 20px;

    .lost-item-card {
        min-width: 23vw;
        max-width: 23vw;
        margin-bottom: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }
}
</style>
