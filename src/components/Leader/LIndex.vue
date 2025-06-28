<script setup>
import {
  Iphone,
  User,
  List
} from '@element-plus/icons-vue'
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import { getApplication, getUserInfo} from "@/api/user.js";
import {myContact} from "@/api/all.js";

const route = useRoute()
const application = ref([
  {
    type: '1',
    id: '1234'
  },
  {
    type:'2'
  }
])

const leader = ref({
  name: '丘俊杰',
  id: '2022141460001',
  contact: 'wx:mx11224qiu',
  park:'乐创',
  building:'翠竹',
  floor:'6',
  room:'628',
  bed:'3',
  password: '123456'
})

leader.value.id = route.query.id

function getInfo() {
  getUserInfo().then(res => {
    leader.value = res.data.records
  })
}

getInfo();
const resetPassword = ref(false)
const oldPassword = ref('')//旧密码
const newPassword = ref('')//新密码
const newAgainPassword = ref('') //再次输入新密码
const getStatusApl = (status) => {
  return {
    'status-pending': status === '待审核',
    'status-processing': status === '待处理',
    'status-completed': status === '已处理',
    'status-out': status==='不通过'
  }
}
const formLabelWidth = '140px'

const solveContact = () => {
  myContact(leader.value.contact).then(res=>{
    if(res.data.message)
      ElMessage({
        message:'保存成功！',
        type:'success'
      })
    getInfo()
  })
}

const resetCheck = () => {
  // resetPassword.value = false
  if (!oldPassword.value || !newPassword.value || !newAgainPassword.value) {
    ElMessage({
      message: '请输入完整！',
      type: "error"
    })
    return
  }
  if (oldPassword.value !== leader.value.password) {
    ElMessage({
      message: '旧密码错误！',
      type: "error"
    })
  } else if (newPassword.value !== newAgainPassword.value) {
    ElMessage({
      message: '新密码不一致！',
      type: "error"
    })
  } else {
    ElMessage({
      message: '修改成功！',
      type: "success"
    })
    resetPassword.value = false
    getInfo()
  }
}
const getMyAppAudit = () => {
  getApplication('待审核').then(res => {
    application.value = res.data.records
  })
}
const clearForm = () => {
  resetPassword.value = true
  oldPassword.value = ''
  newPassword.value = ''
  newAgainPassword.value = ''
}

getMyAppAudit()
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
        <el-button @click="solveContact" type="primary">保存</el-button>
        <el-button @click="clearForm" type="danger">修改密码</el-button>
        <el-dialog v-model="resetPassword" title="修改密码" width="500" center>
          <template #footer>
            <div class="dialog-footer">
              <el-form>
                <el-form-item label="旧密码" :label-width="formLabelWidth">
                  <el-input type="text" v-model="oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth">
                  <el-input type="password" v-model="newPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" :label-width="formLabelWidth">
                  <el-input type="password" v-model="newAgainPassword" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="resetCheck">确认</el-button>
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
        {{ leader.name }}
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
        <el-input v-model="leader.contact" type="text" placeholder="请输入具体的联系方式，如wx：mx11224qiu"></el-input>
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
        {{ leader.id }}
      </el-descriptions-item>
    </el-descriptions>
    审核记录：
    <el-table :data="application" border style="width: 100%;">
      <el-table-column prop="type" label="类型" max-width="150"/>
      <el-table-column prop="id" label="申请人ID" width="180"/>
      <el-table-column prop="changeId" label="交换人ID" width="180"/>
      <el-table-column prop="park" label="园区" max-width="150"/>
      <el-table-column prop="building" label="楼栋" max-width="150"/>
      <el-table-column prop="floor" label="楼层" max-width="150"/>
      <el-table-column prop="room" label="房间" max-width="150"/>
      <el-table-column prop="bed" label="床位" max-width="150"/>
      <el-table-column prop="outRoom" label="校外住宿" width="180"/>
      <el-table-column prop="process" label="进度" max-width="150">
        <template #default="{ row }">
          <span :class="getStatusApl(row.process)">{{ row.process }}</span>
        </template>
      </el-table-column>
    </el-table>
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