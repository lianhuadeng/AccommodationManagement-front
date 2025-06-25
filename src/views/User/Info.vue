<script lang="ts" setup>
import { Avatar, Phone, Message } from '@element-plus/icons-vue'
import { onMounted } from 'vue';
import { ref } from 'vue';
import { getUserInfoService } from '@/api/user';
import { useRouter } from 'vue-router';
import { updatePhoneService } from '@/api/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userData = ref({
    userName: '',
    phone: '',
    email: ''
});

const updatePhone = async () => {
    const result = await updatePhoneService(userData.value.phone);
    if (result.code === 0) {
        ElMessage.success('修改成功');
    } else {
        ElMessage.error(result.message);
    }
};

const rules = {
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    email: [
        {
            validator: (rule, value, callback) => {
                if (value) {
                    // 跳转到修改邮箱界面
                    router.push('/user/changeEmail'); // 假设路由名称为'ModifyEmail'
                    ElMessage.warning('如需修改邮箱，请点击左侧菜单栏“修改邮箱”');
                    callback(); // 调用回调函数以确保验证通过
                } else {
                    callback(new Error('请输入邮箱'));
                }
            },
            trigger: 'blur'
        }
    ]
};

const getUserInfo = async () => {
    const result = await getUserInfoService();
    userData.value = result.data;
};

onMounted(() => {
    getUserInfo();
});

</script>

<template>
    <div class="info-page">
        <el-form class="info-form" size="large" autocomplete="off" :model="userData" :rules="rules">
            <el-form-item>
                <h1>用户详情</h1>
            </el-form-item>
            <el-form-item>
                <el-input :prefix-icon="Avatar" disabled v-model="userData.userName"></el-input>
            </el-form-item>
            <el-form-item prop="phone">
                <el-input :prefix-icon="Phone" v-model="userData.phone"></el-input>
            </el-form-item>
            <el-form-item prop="email">
                <el-input :prefix-icon="Message" v-model="userData.email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="button" type="primary" auto-insert-space @click="updatePhone();">
                    确定修改
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.info-page {
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(90vh - 80px);

    .info-form {
        width: 20vw;
        min-width: 450px;
        /* 表单最大宽度 */
        background-color: #ffffff;
        /* 表单背景色 */
        padding: 20px;
        /* 内边距 */
        border-radius: 8px;
        /* 圆角 */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        /* 阴影效果 */
        user-select: none;

        .button {
            width: 100%;
        }

        h1 {
            text-align: center;
            /* 标题居中 */
            margin-bottom: 20px;
            /* 间距 */
        }
    }
}
</style>
