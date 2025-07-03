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
  <div class="background-container">
    <div class="login-container">
      <el-row class="login-page">
        <el-col :span="7" class="form">
          <!-- 登录表单 -->
          <el-form ref="formRef" size="large" autocomplete="off" :model="loginData" @keyup.enter.native="login"
                   :rules="rules">
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.background-container {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  /* 背景图片设置 */
  background-image: url('/src/assets/image/login-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3));
    z-index: 0;
  }
}

.login-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end; /* 使内容靠右 */
  align-items: center;
  padding-right: 10%; /* 右侧留出空间 */
  z-index: 1;
}

.login-page {
  width: 420px;
  z-index: 2;
  animation: fadeInRight 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  .form {
    min-width: 400px;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 40px 35px;
    border-radius: 12px;
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.25);
    user-select: none;

    h1 {
      text-align: center;
      margin-bottom: 30px;
      font-size: 24px;
      color: #2c3e50;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .button {
      width: 100%;
      height: 42px;
      font-size: 16px;
      border: none;
      transition: all 0.3s ease;
      letter-spacing: 2px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .login-container {
    justify-content: center;
    padding-right: 0;
  }

  .login-page {
    width: 90%;
    max-width: 500px;

    .form {
      min-width: auto;
      width: 100%;
    }
  }
}

@media (max-height: 700px) {
  .login-page {
    transform: scale(0.9);
    transform-origin: center;
  }
}

/* 动画效果 */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 标题装饰效果 */
h1 {
  position: relative;
  padding-bottom: 15px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #3498db, #2c3e50);
    border-radius: 3px;
  }
}
</style>
