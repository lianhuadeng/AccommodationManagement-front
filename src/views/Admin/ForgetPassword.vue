<script lang="ts" setup>
import { ref } from 'vue'
import { Lock, Message } from '@element-plus/icons-vue'
import { checkEmailService, checkCodeService, forgetPasswordService, sendCodeService } from '@/api/admin';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter();
const activeStep = ref(1)

const forgetPasswordData = ref({
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
})

const handleNext_1 = async () => {
    const result = await checkEmailService(forgetPasswordData.value.email)
    if (result.code === 1) {
        ElMessage.error(result.message)
        return
    }
    sendCode();
    activeStep.value = 2
}

const handleNext_2 = async () => {
    const result = await checkCodeService(forgetPasswordData.value)
    if (result.code === 1) {
        ElMessage.error(result.message)
        return
    }
    activeStep.value = 3
}

const handleSubmit = async () => {
    const result = await forgetPasswordService(forgetPasswordData.value)
    if (result.code === 1) {
        ElMessage.error(result.message)
        return
    }
    ElMessage.success('密码重置成功，请重新登录')
    router.push('/adminLogin')
}

const sendCode = async () => {
    const email = forgetPasswordData.value.email;
    let result = await sendCodeService(email);
    if (result.code === 0) {
        ElMessage({
            message: '验证码发送成功，请查收！',
            type: 'success',
        });
    } else {
        ElMessage({
            message: '验证码发送失败，请检查邮箱是否正确！',
            type: 'error',
        });
    }

};

const rules = {
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] } // 支持多事件触发
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '验证码长度为 6', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
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
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== forgetPasswordData.value.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ]
};


</script>

<template>
    <el-container style="height: 30vh;" class="container">
        <el-steps style="max-width: 600px" :active="activeStep" align-center class="steps">
            <el-step title="Step 1" description="输入邮箱" />
            <el-step title="Step 2" description="输入验证码" />
            <el-step title="Step 3" description="重置密码" />
        </el-steps>
    </el-container>
    <div style="height: 70vh;" class="forget-password-page">
        <el-form class="forget-password-form" v-model="forgetPasswordData">
            <el-form-item v-if="activeStep === 1" prop="email">
                <el-input :prefix-icon="Message" v-model="forgetPasswordData.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item v-if="activeStep === 1">
                <el-button type="primary" style="margin: 0 auto;" @click="handleNext_1()"
                    @@keyup.enter.native.prevent="handleNext_1()">下一步</el-button>
            </el-form-item>
            <el-form-item v-if="activeStep === 2">
                <el-input v-model="forgetPasswordData.code" placeholder="请输入验证码" />
            </el-form-item>
            <el-form-item v-if="activeStep === 2">
                <el-button type="primary" style="margin: 0 auto;" @click="handleNext_2()"
                    @keyup.enter.native.prevent="handleNext_2()">下一步</el-button>
            </el-form-item>
            <el-form-item v-if="activeStep === 3">
                <el-input :prefix-icon="Lock" type="password" v-model="forgetPasswordData.password"
                    placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item v-if="activeStep === 3">
                <el-input :prefix-icon="Lock" type="password" v-model="forgetPasswordData.confirmPassword"
                    placeholder="请再次输入新密码" />
            </el-form-item>
            <el-form-item v-if="activeStep === 3">
                <el-button type="primary" style="margin: 0 auto;" @click="handleSubmit()"
                    @keyup.enter.native.prevent="handleSubmit()">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
}

.steps {
    margin-top: 10vh;
    width: 50%;
}

.forget-password-page {
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;


    .forget-password-form {
        width: 20vw;
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
