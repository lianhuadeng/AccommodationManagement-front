<script setup>
import {
  Iphone,
  Location,
  User,
  List,
  Lock, Plus
} from '@element-plus/icons-vue'
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import {
  changePasswordService,
  getUserInfoService,
  updateContactService
} from "@/api/user.js";
import {myApplicationService, cancelApplicationService} from "@/api/application.js";
import {myRepairService} from "@/api/repair.js";
import {useTokenStore} from "@/stores/token.js";

const router = useRouter()
const route = useRoute()
const application = ref([])
const maintenance = ref([])
const tokenStore = useTokenStore()
const stu = ref({
  name: null,
  id: null,
  contact: null,
  location: null
})

stu.value.id = route.query.id

const getInfo = async () => {
  try {
    const result = await getUserInfoService();
    stu.value.id = result.data.userId
    stu.value.name = result.data.name
    stu.value.contact = result.data.contact
    stu.value.location = result.data.location
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
    } else {
    ElMessage({
      message: result.message,
      type: 'error',
    });
  }
}

const formLabelWidth = '140px'

const updateContact = async () => {
  const result = await updateContactService(stu.value.contact);
  if (result.status) {
    await getInfo()
    ElMessage.success(result.message)
  } else {
    ElMessage.error(result.message)
  }
}

const getMyApplication = async () => {
  const result = await myApplicationService();
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
const getStatusMai = (status) => {
  return {
    'status-pending': status === '待分配',
    'status-processing': status === '待处理',
    'status-completed': status === '已处理'
  }
}
const undoApl = async (applicationId) => {
  const result = await cancelApplicationService(applicationId);
  if (result.status) {
    ElMessage.success("撤销成功")
    await getMyApplication();
  } else {
    ElMessage.error(result.message)
  }
}

const getMyMaintenance = async () => {
  const result = await myRepairService();

  if (result.status){
    maintenance.value = result.data
    console.log(maintenance.value)

  }else{
    ElMessage.error(result.message)
  }
}
getMyApplication()
getMyMaintenance()
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
                <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
                  <el-input :prefix-icon="Lock" type="password" v-model="changePasswordData.newPassword"
                            autocomplete="off" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="confirmPassword">
                  <el-input :prefix-icon="Lock" type="password" v-model="changePasswordData.confirmPassword"
                            autocomplete="off" placeholder="请再次输入密码"></el-input>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="changePassword">确认</el-button>
              <el-button @click="resetPassword = false;">取消</el-button>
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
        {{ stu.name }}
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
        <el-input v-model="stu.contact" type="text" placeholder="请输入具体的联系方式，如wx：mx11224qiu"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <List/>
            </el-icon>
            学号
          </div>
        </template>
        {{ stu.id }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <Location/>
            </el-icon>
            宿舍位置
          </div>
        </template>
        {{ stu.location }}
      </el-descriptions-item>
    </el-descriptions>
    <br>
    我的宿舍调整申请：
    <el-table :data="application" border style="width: 100%;">
      <el-table-column prop="applicationType" label="申请类型"/>
      <el-table-column prop="targetLocation" label="申请目标地址"/>
      <el-table-column prop="applicationTime" label="申请时间"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="opinion" label="审核意见"/>
      <el-table-column prop="status" label="处理进度" width="180">
        <template #default="{ row }">
          <span :class="getStatusApl(row.status)">{{ row.status }}</span>
          <el-button v-if="row.status!=='已处理'&&row.status!=='不通过'" @click='undoApl(row.applicationId)'
                     type="danger"
                     style="margin-left:30%">撤销
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div style="border:dotted #AB3723 0.5vmin">
      维修申请：
    <el-table :data="maintenance" border style="width: 100%;">
      <el-table-column prop="repairItem" label="维修项目"/>
      <el-table-column prop="pictureUrl" label="图片详情">
        <template #default="{ row }">
          <el-image :src="row.pictureUrl" style="width: 60px; height: 60px;" fit="cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间"/>
      <el-table-column prop="location" label="位置"/>
      <el-table-column prop="content" label="维修详情"/>
      <el-table-column prop="maintainerName" label="维修人员">
<!--        TODO: 维修人联系方式-->
      </el-table-column>
      <el-table-column prop="status" label="处理进度" width="180">
        <template #default="{ row }">
          <span :class="getStatusMai(row.status)">{{ row.status }}</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>

</template>

<style scoped>

.cell-item {
  display: flex;
  align-items: center;
}

.margin-top {
  margin-top: 20px;
  border:solid #AB3723 0.5vmin;
  border-radius:1%;
  padding: 1vmin;
}

.status-out {
  color: #ff0000;
}

.status-pending {
  color: #271e1e;
}

.status-processing {
  color: #e6a23c;
}

.status-completed {
  color: #67c23a;
}
</style>