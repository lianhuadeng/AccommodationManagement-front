<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { recentLostItemsService } from '@/api/LostItem.js'
import { recentFoundItemsService } from '@/api/FoundItem.js'
import { recentMessagesService } from '@/api/message.js'
import { recentAnnouncementsService } from '@/api/Announcement'
import { getUserNameByIdService, getUserEmailService, getUserContactService } from '@/api/user.js'
import { useTokenStore } from '@/stores/token.js'
import { categoryListService } from '@/api/Category.js';

const categorys = ref([])
const categoryList = async () => {
    let result = await categoryListService();
    categorys.value = result.data;
}
categoryList()

const tokenStore = useTokenStore()

// 弹窗相关
const dialogVisible_Found = ref(false)
const dialogVisible_Lost = ref(false)
const dialogItem = ref();
const showDialog_Found = (item) => {
    dialogItem.value = item; // 将点击的foundItem赋值给dialogItem
    dialogVisible_Found.value = true; // 打开dialog
};

const showDialog_Lost = (item) => {
    dialogItem.value = item; // 将点击的lostItem赋值给dialogItem
    dialogVisible_Lost.value = true; // 打开dialog
};

//格式化时间
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

const router = useRouter()

const lostItems = ref([])
const foundItems = ref([])
const messages = ref([])
const announcements = ref([])

// 缓存用户ID和用户名的映射
const userNameMap = ref(new Map());
const userContactMap = ref(new Map());
const userEmailMap = ref(new Map());

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
            userEmailMap.value.set(userID, "登录以获取邮箱");
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
            const response = await getUserContactService(userID); // 异步请求
            if (response.data) {
                userContactMap.value.set(userID, response.data); // 缓存结果
            } else {
                userContactMap.value.set(userID, "用户未设置电话号码"); // 处理异常
            }
        } catch (error) {
            userContactMap.value.set(userID, "登录以获取电话号码");
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

// 在加载数据时调用
const recentLostItems = async () => {
    const result = await recentLostItemsService();
    lostItems.value = result.data;

    for (let i = 0; i < lostItems.value.length; i++) {
        let foundItem = lostItems.value[i]
        for (let j = 0; j < categorys.value.length; j++) {
            if (foundItem.categoryID === categorys.value[j].categoryID) {
                foundItem.categoryName = categorys.value[j].categoryName
            }
        }
    }

    await processUserNames(result.data); // 加载用户名
    await processUserContact(result.data); // 加载联系方式
    await processUserEmail(result.data); // 加载邮箱
};

const recentFoundItems = async () => {
    const result = await recentFoundItemsService();
    foundItems.value = result.data;
    for (let i = 0; i < foundItems.value.length; i++) {
        let foundItem = foundItems.value[i]
        for (let j = 0; j < categorys.value.length; j++) {
            if (foundItem.categoryID === categorys.value[j].categoryID) {
                foundItem.categoryName = categorys.value[j].categoryName
            }
        }
    }
};

const recentMessages = async () => {
    const result = await recentMessagesService();
    messages.value = result.data;
};

const recentAnnouncements = async () => {
    const result = await recentAnnouncementsService();
    announcements.value = result.data;
};

recentMessages()
recentLostItems()
recentFoundItems()
recentAnnouncements()

</script>

<template>
    <!-- 公告轮播 -->
    <el-carousel :interval="4000" type="card" height="200px" class="announcement">
        <el-carousel-item v-for="announcement in announcements" :key="announcement.announcementID">
            <h1>{{ announcement.title }}</h1>
            <p>{{ announcement.content }}</p>
        </el-carousel-item>
    </el-carousel>
    <el-container class="latestItems">
        <!-- 寻物启事 -->
        <el-container class="lostItems">
            <el-header class="lostHeader">
                <div class="lostLogo"></div>
                <span class="lostTitle_1">最新寻物启事</span>
                <span class="lostTitle_2">Latest Lost Items</span>
                <el-link type="info" :underline="false" @click="router.push('/lostItem/list')">
                    更多>>
                </el-link>
            </el-header>
            <el-divider />
            <el-main class="lostMain">
                <el-card v-for="item in lostItems" :key="item.lostID" class="lostCard">
                    <template #header>{{ item.itemName }}</template>
                    <img :src="item.imageURL" alt="图片" style="width: 100%" @click="showDialog_Lost(item)" />
                    <el-collapse>
                        <el-collapse-item :title="'发布人：' + userNameMap.get(item.userID)" name="1">
                            <div>描述: {{ item.description }}</div>
                            <div>位置: {{ item.location }}</div>
                            <div>丢失时间: {{ formatDate(item.lostTime) }}</div>
                        </el-collapse-item>
                    </el-collapse>
                    <div @click="showDialog_Lost(item)">发布时间: {{ formatDate(item.updatedAt) }}</div>
                </el-card>
            </el-main>
        </el-container>
        <!-- 失物招领 -->
        <el-container class="foundItems">
            <el-header class="foundHeader">
                <div class="foundLogo"></div>
                <span class="foundTitle_1">最新失物招领</span>
                <span class="foundTitle_2">Latest Found Items</span>
                <el-link type="info" :underline="false" @click="router.push('/foundItem/list')">
                    更多>>
                </el-link>
            </el-header>
            <el-divider />
            <el-main class="foundMain">
                <el-card v-for="item in foundItems" :key="item.foundID" class="foundCard">
                    <template #header>{{ item.itemName }}</template>
                    <img :src="item.imageURL" alt="图片" style="width: 100%" @click="showDialog_Found(item)" />
                    <el-collapse>
                        <el-collapse-item :title="'发布人：' + userNameMap.get(item.userID)" name="1">
                            <div>描述: {{ item.description }}</div>
                            <div>位置: {{ item.location }}</div>
                            <div>发现时间: {{ formatDate(item.foundTime) }}</div>
                        </el-collapse-item>
                    </el-collapse>
                    <div @click="showDialog_Found(item)">发布时间: {{ formatDate(item.updatedAt) }}</div>
                </el-card>
            </el-main>
        </el-container>
    </el-container>
    <!-- 留言 -->
    <el-container class="message">
        <el-header class="messageHeader">
            <div class="messageLogo"></div>
            <span class="messageTitle_1">最新留言</span>
            <span class="messageTitle_2">Latest Messages</span>
            <el-link type="info" :underline="false" @click="router.push('/message/list')">
                更多>>
            </el-link>
        </el-header>
        <el-divider />
        <el-table :data="messages" stripe style="width: 100%">
            <!-- 格式化时间 -->
            <el-table-column label="发布时间" width="180">
                <template #default="{ row }">
                    {{ formatDate(row.updatedAt) }}
                </template>
            </el-table-column>
            <el-table-column label="发布者" width="180">
                <template #default="{ row }">
                    {{ userNameMap.get(row.userID) }}
                </template>
            </el-table-column>
            <el-table-column prop="content" label="留言信息" />
        </el-table>
    </el-container>
    <!-- 寻物启事详情弹窗 -->
    <el-dialog v-model="dialogVisible_Lost" title="详情" width="30%">
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
                <span v-if="tokenStore.token">
                    电话号码:&nbsp;&nbsp;&nbsp;{{ userContactMap.get(dialogItem?.userID) }}
                    <br>
                    Email:&nbsp;&nbsp;&nbsp;{{ userEmailMap.get(dialogItem?.userID) }}
                </span>
                <span v-else>登录以获取联系方式</span>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 失物招领详情弹窗 -->
    <el-dialog v-model="dialogVisible_Found" title="详情" width="30%">
        <el-form label-width="100px" style="padding-right: 30px">
            <el-form-item label="物品名称：">
                <span>{{ dialogItem?.itemName }}</span>
            </el-form-item>
            <el-form-item label="物品分类：">
                <span>{{ dialogItem?.categoryName }}</span>
            </el-form-item>
            <el-form-item label="找到地点：">
                <span>{{ dialogItem?.location }}</span>
            </el-form-item>
            <el-form-item label="找到时间：">
                <span>{{ formatDate(dialogItem?.foundTime) }}</span>
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
</template>

<style lang="scss" scoped>
.el-carousel__item {
    padding: 20px; // 内边距增加内容呼吸空间
    text-align: center;
    // transition: all 0.5s ease-in-out; // 平滑过渡
    // opacity: 0;

    h1 {
        font-size: 24px;
        font-weight: bold;
        color: #333; // 深灰色字体
        margin-bottom: 10px; // 标题和内容间的间距
    }

    p {
        display: -webkit-box; // Flex 布局
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis; // 超出部分省略
        word-break: break-word; // 避免单词超出边界
    }
}

// .el-carousel__item.is-active {
//     opacity: 1; // 当前项完全显示
// }

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.announcement {
    margin-top: 20px;
}

.latestItems {
    display: flex;
    justify-content: space-between; // 子项之间保持间距
    gap: 20px; // 控制子项间距
    margin-top: 20px;

    .lostItems,
    .foundItems {
        width: 45%;

        .lostHeader,
        .foundHeader {
            display: flex; // 让内容在一行
            align-items: center; // 垂直居中
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

            el-link {
                margin-left: auto; // 将“更多”推到右边
            }
        }

        .lostMain,
        .foundMain {
            display: flex;
            flex-wrap: wrap; // 子项换行
            gap: 20px; // 子项之间的间距
            justify-content: space-between; // 保持子项之间均匀分布

            .lostCard,
            .foundCard {
                min-width: 45%;
                max-width: 45%;
            }
        }
    }

}

.message {
    margin-top: 10px;

    .messageHeader {
        display: flex; // 让内容在一行
        align-items: center; // 垂直居中
        height: 10vh;

        .messageLogo {
            width: 30px;
            height: 30px;
            background-image: url('/public/MessageLogo.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin-right: 10px; // 图标与标题之间的间距
        }

        .messageTitle_1 {
            font-weight: bold;
            font-size: 16px;
            margin-right: 10px; // 与副标题的间距
        }

        .messageTitle_2 {
            color: #bfbfbf; // 浅灰色
            font-size: 14px;
            margin-right: 10px; // 与“更多”链接的间距
        }

        el-link {
            margin-left: auto; // 将“更多”推到右边
        }
    }
}
</style>
