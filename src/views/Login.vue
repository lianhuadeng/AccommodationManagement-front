<script setup>
import {ElMessage} from "element-plus";
import {reactive, ref} from "vue"

const loginForm = reactive({
  username: '',
  password: '',
  code: '',
  remember: false
});

// 忘记密码表单数据
const forgetForm = reactive({
  username: '',
  email: '',
  code: ''
});

// 表单引用
const loginFormRef = ref(null);

// 状态变量
const loading = ref(false);
const loginSuccess = ref(false);
const loginError = ref('');
const forgetDialogVisible = ref(false);
const countdown = ref(0);
const captchaImage = ref('https://picsum.photos/120/40?t=' + Date.now());

// 表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名或学号', trigger: 'blur' },
    { min: 6, message: '用户名长度至少6位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{4}$/, message: '验证码格式不正确', trigger: 'blur' }
  ]
});

// 刷新验证码
const refreshCode = () => {
  captchaImage.value = `https://picsum.photos/120/40?t=${Date.now()}`;
};

// 显示忘记密码对话框
const showForgetDialog = () => {
  forgetDialogVisible.value = true;
  // 重置表单
  forgetForm.username = '';
  forgetForm.email = '';
  forgetForm.code = '';
};

// 发送验证码
const sendCode = () => {
  if (!forgetForm.email) {
    ElMessage.warning('请输入邮箱地址');
    return;
  }

  // 验证邮箱格式
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(forgetForm.email)) {
    ElMessage.warning('请输入有效的邮箱地址');
    return;
  }

  // 模拟发送验证码
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);

  ElMessage.success('验证码已发送到您的邮箱');
};

// 处理忘记密码
const handleForgetPassword = () => {
  if (!forgetForm.username || !forgetForm.email || !forgetForm.code) {
    ElMessage.warning('请填写完整信息');
    return;
  }

  // 模拟处理忘记密码请求
  setTimeout(() => {
    forgetDialogVisible.value = false;
    ElMessage.success('密码重置链接已发送到您的邮箱，请查收');
  }, 1000);
};

// 处理登录
const handleLogin = () => {
  loginFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      loginSuccess.value = false;
      loginError.value = '';

      // 模拟API请求
      setTimeout(() => {
        loading.value = false;

        // 模拟登录成功条件
        if (loginForm.username === 'admin' && loginForm.password === '123456' && loginForm.code === '1234') {
          loginSuccess.value = true;
          loginError.value = '';

          // 模拟跳转
          setTimeout(() => {
            ElMessage.success('登录成功，即将跳转到系统主页');
            // 实际项目中这里应该是 this.$router.push('/dashboard')
          }, 1000);
        } else {
          loginError.value = '用户名、密码或验证码错误，请重试';
          refreshCode(); // 刷新验证码
        }
      }, 1500);
    }
  })
}
</script>

<template>
  <div>
    <div class="login-container">
      <!-- 左侧信息面板 -->
      <div class="left-panel">
        <div class="logo">
          <i class="fas fa-building logo-icon"></i>
          <div class="logo-text">高校住宿管理系统</div>
        </div>
        <h1 class="welcome-title">欢迎使用高校宿舍管理系统</h1>
        <p class="welcome-text">
          本系统为高校提供全方位的宿舍管理解决方案，包括学生住宿分配、宿舍报修、访客管理、水电费管理等功能，帮助学校实现宿舍管理的数字化和智能化。
        </p>

        <div class="features">
          <div class="feature">
            <div class="feature-icon"><i class="fas fa-check"></i></div>
            <div class="feature-text">学生住宿信息数字化管理</div>
          </div>
          <div class="feature">
            <div class="feature-icon"><i class="fas fa-check"></i></div>
            <div class="feature-text">在线报修与进度跟踪</div>
          </div>
          <div class="feature">
            <div class="feature-icon"><i class="fas fa-check"></i></div>
            <div class="feature-text">访客登记与安全管理</div>
          </div>
          <div class="feature">
            <div class="feature-icon"><i class="fas fa-check"></i></div>
            <div class="feature-text">水电费用在线查询与缴纳</div>
          </div>
          <div class="feature">
            <div class="feature-icon"><i class="fas fa-check"></i></div>
            <div class="feature-text">宿舍分配与调整管理</div>
          </div>
          <div class="feature">
            <div class="feature-icon"><i class="fas fa-check"></i></div>
            <div class="feature-text">违规行为记录与处理</div>
          </div>
        </div>
      </div>

      <!-- 右侧登录面板 -->
      <div class="right-panel">
        <div class="login-header">
          <h2 class="login-title">用户登录</h2>
          <p class="login-subtitle">欢迎使用高校住宿管理系统</p>
        </div>

        <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名或学号"
                size="large"
            >
              <template #prefix>
                <i class="fas fa-user"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                show-password
            >
              <template #prefix>
                <i class="fas fa-lock"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="code">
            <div style="display: flex; gap: 10px;">
              <el-input
                  v-model="loginForm.code"
                  placeholder="请输入验证码"
                  size="large"
                  style="flex: 1;"
              >
                <template #prefix>
                  <i class="fas fa-shield-alt"></i>
                </template>
              </el-input>
              <div style="cursor: pointer; border: 1px solid #dcdfe6; border-radius: 4px; overflow: hidden;" @click="refreshCode">
                <img :src="captchaImage" alt="验证码" style="height: 40px; width: 120px;">
              </div>
            </div>
          </el-form-item>

          <div class="form-footer">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <el-link type="primary" :underline="false" @click="showForgetDialog">忘记密码?</el-link>
          </div>

          <el-button
              type="primary"
              class="login-btn"
              native-type="submit"
              :loading="loading"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>

          <div class="status-message">
            <el-alert
                v-if="loginSuccess"
                title="登录成功！正在跳转..."
                type="success"
                :closable="false"
                center
                show-icon
            />
            <el-alert
                v-if="loginError"
                :title="loginError"
                type="error"
                :closable="false"
                center
                show-icon
            />
          </div>
        </el-form>

        <div class="other-login">
          <div class="other-title">其他登录方式</div>
          <div class="social-login">
            <div class="social-btn wechat">
              <i class="fab fa-weixin"></i>
            </div>
            <div class="social-btn qq">
              <i class="fab fa-qq"></i>
            </div>
            <div class="social-btn alipay">
              <i class="fab fa-alipay"></i>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>© 2023 高校住宿管理系统 v3.5</p>
          <p>技术支持: 信息中心 电话: 123-4567890</p>
        </div>
      </div>
    </div>

    <!-- 忘记密码对话框 -->
    <el-dialog v-model="forgetDialogVisible" title="找回密码" width="30%">
      <el-form :model="forgetForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="forgetForm.username" placeholder="请输入用户名或学号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="forgetForm.email" placeholder="请输入注册邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <div style="display: flex; gap: 10px;">
            <el-input v-model="forgetForm.code" placeholder="请输入验证码"></el-input>
            <el-button type="primary" :disabled="countdown > 0" @click="sendCode">
              {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="forgetDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleForgetPassword">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style  scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

body {
  background: linear-gradient(135deg, #1a2a6c, #2c3e50);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  height: 85vh;
}

.left-panel {
  flex: 1.2;
  background: linear-gradient(to right bottom, #1a2a6c, #3a7bd5);
  color: white;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.left-panel::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.left-panel::after {
  content: '';
  position: absolute;
  bottom: -80px;
  left: -30px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 36px;
  margin-right: 15px;
  color: #FFD700;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}

.welcome-text {
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
  opacity: 0.9;
}

.features {
  margin-top: 30px;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.feature-icon {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  font-size: 12px;
  flex-shrink: 0;
}

.feature-text {
  font-size: 14px;
}

.right-panel {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 28px;
  color: #1a2a6c;
  font-weight: 700;
  margin-bottom: 10px;
}

.login-subtitle {
  color: #7f8c8d;
  font-size: 16px;
}

.login-form {
  margin-top: 20px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.login-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  margin-top: 20px;
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.other-login {
  margin-top: 30px;
  text-align: center;
}

.other-title {
  position: relative;
  color: #7f8c8d;
  margin-bottom: 20px;
  font-size: 14px;
}

.other-title::before,
.other-title::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #e0e6ed;
}

.other-title::before {
  left: 0;
}

.other-title::after {
  right: 0;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.social-btn:hover {
  transform: translateY(-3px);
}

.social-btn.wechat {
  background: #2ecc71;
}

.social-btn.qq {
  background: #3498db;
}

.social-btn.alipay {
  background: #027AFF;
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: #7f8c8d;
  font-size: 14px;
}

.status-message {
  margin-top: 15px;
  text-align: center;
  height: 24px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .login-container {
    width: 95%;
  }

  .features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    height: auto;
  }

  .left-panel {
    padding: 40px 30px;
  }

  .right-panel {
    padding: 40px 30px;
  }
}

@media (max-width: 480px) {
  .login-container {
    border-radius: 10px;
  }

  .left-panel, .right-panel {
    padding: 30px 20px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .login-title {
    font-size: 24px;
  }
}
</style>
