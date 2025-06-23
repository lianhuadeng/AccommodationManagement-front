<script setup>
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
import { userRegisterService, sendCodeService, userLoginService } from '@/api/user.js'
import { useTokenStore } from '@/stores/token.js';
// 导入路由
import { useRouter } from 'vue-router'
const router = useRouter()
//控制注册与登录表单的显示， 默认显示注册

//登录表单数据
const loginData = ref({
    userNameOrEmail: '',
    password: ''
})
//控制验证码发送间隔
const isCodeSent = ref(false);
const countdown = ref(60);

// 清空表单数据
const clearFormData = () => {
    loginData.value = {
        userNameOrEmail: '',
        password: ''
    };
};

//定义表单校验规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个非空字符', trigger: 'blur' }
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
    repassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码!'))
                } else if (value !== registerData.value.password) {
                    callback(new Error('两次输入的密码不一致!'))
                } else {
                    callback()
                }
            }, trigger: 'blur'
        }
    ]
}


const tokenStore = useTokenStore();

// 调用后台接口登录
const login = async () => {
    try {
        let result = await userLoginService(loginData.value);
        if (result.code === 0) {
            ElMessage({
                message: '登录成功',
                type: 'success',
            });

            // 保存 token到pinia中
            tokenStore.setToken(result.data);

            // 跳转到首页
            router.push('/');
        } else {
            ElMessage({
                message: result.message || '登录失败，请检查输入信息！',
                type: 'error',
            });
        }
    } catch (error) {
        ElMessage({
            message: '登录过程中发生错误，请稍后再试！',
            type: 'error',
        });
    }
};
</script>

<template>
    <el-row class="login-page">
        <el-col :span="7" class="form">
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" :model="loginData" @keyup.enter.native="login()">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="User" placeholder="请输入用户名或邮箱"
                        v-model="loginData.userNameOrEmail"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="loginData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    /* 高度占满屏幕 */
    background-color: #f5f5f5;
    /* 灰色背景 */
    display: flex;
    /* 使用 flex 布局 */
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */

    .form {
        width: 100%;
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

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
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
