<script setup>
import {User, Lock} from '@element-plus/icons-vue'
import {reactive, ref} from 'vue'
import {ElMessage} from 'element-plus';
import {useTokenStore} from '@/stores/token.js';
// 导入路由
import {useRouter} from 'vue-router'
import {userLoginService} from "@/api/user.js";

const router = useRouter()

//登录表单数据
const loginData = ref({
  userId: null,
  password: null
})

const formRef = ref();

// 清空表单数据
const clearFormData = () => {
  loginData.value = {
    userId: null,
    password: null
  };
};

const rules = reactive({
  userId: [
    {required: true, message: '学号/工号不能为空', trigger: 'blur'},
    {
      pattern: /^\d{6,}$/,   // 正则表达式：至少6位数字
      message: '请输入正确的学号/工号',
      trigger: 'blur'
    }
  ],
  password: [
    {required: true, message: '密码不能为空', trigger: 'blur'},
  ]
});

const tokenStore = useTokenStore();

// 调用后台接口登录
const login = async () => {
  try {
    await formRef.value.validate();

    try {
      const result = await userLoginService(loginData.value);
      if (result.status) {
        ElMessage({
          message: '登录成功',
          type: 'success',
        });
        // 保存 token到pinia中
        tokenStore.setToken(result.data);
        //页面跳转
        switch (result.message) {
          case '学生':
            router.push({path: '/user', query: {id: loginData.value.userId}});
            break;
          case '教师':
            router.push({path: '/user', query: {id: loginData.value.userId}});
            break;
          case '系统管理员':
            router.push({path: '/system', query: {id: loginData.value.userId}});
            break;
          case '分管领导':
            router.push({path: '/leader', query: {id: loginData.value.userId}});
            break;
          case '维修管理员' :
            router.push({path: '/maintenance', query: {id: loginData.value.userId}});
            break;
          case '宿舍管理员':
            router.push({path: '/dormitory', query: {id: loginData.value.userId}});
            break;
          default:
            break;
        }
      } else {
        ElMessage({
          message: result.message || '登录失败，请检查输入信息！',
          type: 'error',
        });
        clearFormData()
      }
    } catch (error) {
      ElMessage({
        message: '登录过程中发生错误，请稍后再试！',
        type: 'error',
      });
    }
  } catch (validateError) {
    ElMessage.warning('请正确填写登录信息');
  }
};
</script>

<template>
  <el-row class="login-page">
    <el-col :span="7" class="form">
      <!-- 登录表单 -->
      <el-form ref="formRef" size="large" autocomplete="off" :model="loginData" @keyup.enter.native="login" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="userId">
          <el-input :prefix-icon="User" placeholder="请输入学号/工号"
                    v-model="loginData.userId"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                    v-model="loginData.password" show-password></el-input>
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
