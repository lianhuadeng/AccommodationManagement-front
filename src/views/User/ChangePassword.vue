<script lang="ts" setup>
import { Lock } from '@element-plus/icons-vue'
import { ref } from 'vue';
import { changePasswordService } from '@/api/user.js';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/token';

const tokenStore = useTokenStore();
const router = useRouter();

const clearFormData = () => {
    data.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
}

const rules = {
    oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个非空字符', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                const hasUpperCase = /[A-Z]/.test(value);
                const hasLowerCase = /[a-z]/.test(value);
                const hasNumber = /[0-9]/.test(value);
                if (!hasUpperCase || !hasLowerCase || !hasNumber) {
                    callback(new Error('密码必须包含大小写字母和数字!'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码!'))
                } else if (value !== data.value.newPassword) {
                    callback(new Error('两次输入的密码不一致!'))
                } else {
                    callback()
                }
            }, trigger: 'blur'
        }
    ]
}

const data = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const changePassword = async () => {
    try {
        const token = tokenStore.token;
        console.log(token);
        const result = await changePasswordService(data.value, token);
        if (result.code === 1) {
            ElMessage.error(result.message);
        } else {
            ElMessage.success("修改成功, 请重新登录");
            tokenStore.removeToken();
            router.push('/login');
        }
        clearFormData();
    } catch (error) {
        ElMessage.error("请求失败，请稍后重试");
    }
}
</script>

<template>
    <div class="update-page">
        <el-form class="update-password-form" size="large" autocomplete="off" :model="data" :rules="rules">
            <el-form-item>
                <h1>修改密码</h1>
            </el-form-item>
            <el-form-item prop="oldPassword">
                <el-input :prefix-icon="Lock" type="password" placeholder="请输入旧密码"
                    v-model="data.oldPassword"></el-input>
            </el-form-item>
            <el-form-item prop="newPassword">
                <el-input :prefix-icon="Lock" type="password" placeholder="请输入新密码"
                    v-model="data.newPassword"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input :prefix-icon="Lock" type="password" placeholder="请再次输入密码"
                    v-model="data.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="button" type="primary" auto-insert-space @click="changePassword();">
                    确定修改
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.update-page {
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(90vh - 80px);

    .update-password-form {
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
