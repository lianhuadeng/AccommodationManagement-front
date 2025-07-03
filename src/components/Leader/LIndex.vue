<script setup>
import {
  Iphone,
  User,
  List, Lock
} from '@element-plus/icons-vue'
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {changePasswordService,  getUserInfoService, updateContactService} from "@/api/user.js";
import {getReviewedApplicationService} from "@/api/application.js";

const router = useRouter()
const application = ref([])

const leader = ref({
  name: null,
  id: null,
  contact: null,
  location: null
})

const getInfo = async () => {
  try {
    const result = await getUserInfoService();
    leader.value.id = result.data.userId
    leader.value.name = result.data.name
    leader.value.contact = result.data.contact
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
  const result = await updateContactService(leader.value.contact);
  if (result.status) {
    await getInfo()
    ElMessage.success(result.message)
  } else {
    ElMessage.error(result.message)
  }
}

const getMyAppAudit = async () => {
  const result = await getReviewedApplicationService()
  if (result.status) {
    application.value = result.data
  } else {
    ElMessage.error(result.message)
  }
}
const clearForm = () => {
  changePasswordData.value.oldPassword = null
  changePasswordData.value.newPassword = null
  changePasswordData.value.confirmPassword = null
}
const getStatusApl = (status) => {
  return {
    'status-pending': status === '待审核',
    'status-processing': status === '待处理',
    'status-completed': status === '已处理',
    'status-out': status === '不通过'
  }
}
getMyAppAudit()
</script>

<template>
  <div class="page-container">
    <div class="header-container">
      <div class="header">
        <div class="icon" id="Information"></div>
        <span id="InformationText" style="">个人信息</span>
      </div>
      <div class="button-group">
        <el-button @click="updateContact" type="primary">修改联系方式</el-button>
        <el-button @click="resetPassword = true;" type="danger">修改密码</el-button>
      </div>
    </div>
    <el-descriptions
        :column="1"
        :size="'large'"
        border
    >
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon style="margin-right: 10px;">
              <user/>
            </el-icon>
            姓名
          </div>
        </template>
        {{ leader.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon style="margin-right: 10px;">
              <iphone/>
            </el-icon>
            联系方式
          </div>
        </template>
        <el-input v-model="leader.contact" type="text" placeholder="请输入具体的联系方式，如wx：mx11224qiu"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon style="margin-right: 10px;">
              <List/>
            </el-icon>
            ID:
          </div>
        </template>
        {{ leader.id }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="header">
      <div class="icon" id="review"></div>
      <span id="reviewText" style="">审核记录</span>
    </div>
    <el-table :data="application" border style="width: 100%; height: 50vh; overflow-y: auto;">
      <el-table-column prop="applicationType" label="申请类型"/>
      <el-table-column prop="targetLocation" label="申请目标地址"/>
      <el-table-column prop="applicationTime" label="申请时间"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="opinion" label="审核意见"/>
      <el-table-column prop="status" label="进度" max-width="150">
        <template #default="{ row }">
          <span :class="getStatusApl(row.status)">{{ row.status }}</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="无审核记录" />
      </template>
    </el-table>
  </div>
  <el-dialog v-model="resetPassword" title="修改密码" width="500" center @close="clearForm">
    <template #footer>
      <div class="dialog-footer">
        <el-form :model="changePasswordData" :rules="rules">
          <el-form-item label="旧密码" :label-width="formLabelWidth">
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

<style scoped>

.page-container {
  padding: 1vmin;
}

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

.status-out {
  color: #f56c6c;
}

.header {
  display: flex;
  align-items: center;
}

/* 标题和按钮布局 */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
}

.icon {
  width: 30px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 10px;
}

.header {
  display: flex;
  align-items: center;
  height: 6vh;
}

#Information {
  background-image: url('/src/assets/image/info.png');
}

#review {
  background-image: url('/src/assets/image/review.png');
}


#InformationText,
#reviewText {
  font-weight: bold;
  font-size: 16px;
  margin-right: 10px;
}
</style>