<script setup>
import {
  Iphone,
  User,
  List, Lock
} from '@element-plus/icons-vue'
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {
  changePasswordService,
  getUserInfoService,
  updateContactService
} from "@/api/user.js";

const route = useRoute()
const application = ref([])

const sys = ref({
  name: null,
  id: null,
  contact: null,
  location: null
})


const getInfo = async () => {
  try {
    const result = await getUserInfoService();
    sys.value.id = result.data.userId
    sys.value.name = result.data.name
    sys.value.contact = result.data.contact
  } catch (error) {
    ElMessage.error("登录过期，请重新登录")
    await router.push('/login');
  }
}

getInfo();
// ----------修改密码--------------
const resetPassword = ref(false)
const changePasswordData = ref({
  oldPassword: null,
  newPassword: null,
  confirmPassword: null
})
const rules = {
  oldPassword: [
    {required: true, message: '请输入旧密码', trigger: 'blur'},
  ],
  newPassword: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码长度在 6 到 20 个非空字符', trigger: 'blur'},
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
    {required: true, message: '请再次输入密码', trigger: 'blur'},
    {min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码!'))
        } else if (value !== changePasswordData.value.newPassword) {
          callback(new Error('两次输入的密码不一致!'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }
  ]
}

const changePassword = async () => {

  const result = await changePasswordService(changePasswordData.value);
  if (result.status) {
    ElMessage({
      message: result.message,
      type: 'success'
    })
    await router.push('/login');
  } else {
    ElMessage({
      message: result.message,
      type: 'error',
    });
  }
}
const formLabelWidth = '140px'

const updateContact = async () => {
  const result = await updateContactService(dor.value.contact);
  if (result.status) {
    await getInfo()
    ElMessage.success(result.message)
  } else {
    ElMessage.error(result.message)
  }
}

const clearForm = () => {
  changePasswordData.value.oldPassword = null
  changePasswordData.value.newPassword = null
  changePasswordData.value.confirmPassword = null
}

</script>

<template>
  <div>
    <el-descriptions
        class="margin-top"
        title="个人信息"
        :column="1"
        :size="'large'"
        border
    >
      <template #extra>
        <el-button @click="updateContact" type="primary">保存</el-button>
        <el-button @click="resetPassword = true;" type="danger">修改密码</el-button>
        <el-dialog v-model="resetPassword" title="修改密码" width="500" center @close="clearForm">
          <template #footer>
            <div class="dialog-footer">
              <el-form :model="changePasswordData" :rules="rules">
                <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPassword">
                  <el-input :prefix-icon="Lock" type="text" v-model="changePasswordData.oldPassword" autocomplete="off"
                            placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth">
                  <el-input :prefix-icon="Lock" type="password" v-model="changePasswordData.newPassword" autocomplete="off"
                            placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" :label-width="formLabelWidth">
                  <el-input :prefix-icon="Lock" type="password" v-model="changePasswordData.confirmPassword" autocomplete="off"
                            placeholder="请再次输入密码"></el-input>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="changePassword">确认</el-button>
              <el-button @click="resetPassword = false">取消</el-button>
            </div>
          </template>
        </el-dialog>
      </template>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user/>
            </el-icon>
            姓名
          </div>
        </template>
        {{ sys.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <iphone/>
            </el-icon>
            联系方式
          </div>
        </template>
        <el-input v-model="sys.contact" type="text" placeholder="请输入具体的联系方式，如wx：mx11224qiu"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <List/>
            </el-icon>
            ID:
          </div>
        </template>
        {{ sys.id }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>

.cell-item {
  display: flex;
  align-items: center;
}

.margin-top {
  margin-top: 20px;
}

.status-pending {
  color: #f56c6c;
}

.status-processing {
  color: #e6a23c;
}

.status-completed {
  color: #67c23a;
}
</style>