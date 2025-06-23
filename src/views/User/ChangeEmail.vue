<script lang="ts" setup>
import { Message } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { changeEmailService } from '@/api/user.js';
import { useTokenStore } from '@/stores/token';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { sendCodeService } from '@/api/user.js';

const countdown = ref(60);
const isCodeSent = ref(false);
const sendCode = async () => {
    if (isCodeSent.value) {
        return; // 如果已经发送过验证码，则不再发送
    }

    try {
        const email = data.value.newEmail;
        let result = await sendCodeService(email);
        if (result.code === 0) {
            ElMessage({
                message: '验证码发送成功，请查收！',
                type: 'success',
            });

            // 设置为已发送状态
            isCodeSent.value = true;

            // 开始倒计时
            const timer = setInterval(() => {
                countdown.value--;
                if (countdown.value <= 0) {
                    clearInterval(timer);
                    isCodeSent.value = false; // 重置状态
                    countdown.value = 60; // 重置倒计时
                }
            }, 1000);
        } else {
            ElMessage({
                message: result.message || '验证码发送失败，请检查输入信息！',
                type: 'error',
            });
        }
    } catch (error) {
        ElMessage({
            message: '验证码发送过程中发生错误，请稍后再试！',
            type: 'error',
        });
    }
};

const router = useRouter();
const tokenStore = useTokenStore();

const clearFormData = () => {
    data.value.newEmail = '';
    data.value.code = '';
};

const data = ref({
    newEmail: '',
    code: ''
});

const rules = {
    newEmail: [
        { required: true, message: '请输入新邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ]
};


const changeEmail = async () => {
    try {
        const token = tokenStore.token;
        const result = await changeEmailService(data.value, token);
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
};

</script>

<template>
    <div class="update-page">
        <el-form class="update-email-form" size="large" autocomplete="off" :model="data" :rules="rules">
            <el-form-item>
                <h1>修改邮箱</h1>
            </el-form-item>
            <el-form-item prop="newEmail">
                <el-input :prefix-icon="Message" placeholder="请输入新邮箱" v-model="data.newEmail"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input placeholder="请输入验证码" style="width: 68%" v-model="data.code"></el-input>
                <el-button type="primary" style="margin-left: auto; width: 30%" :plain="true" :disabled="isCodeSent"
                    @click="sendCode()">
                    {{ isCodeSent ? countdown + '秒后重发' : '发送验证码' }}
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="button" type="primary" auto-insert-space @click="changeEmail(); clearFormData()">
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

    .update-email-form {
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
