<script setup>
//TODO - Update
import {
  Iphone,
  User,
  List
} from '@element-plus/icons-vue'
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {getMaintenance, getUserInfo} from "@/api/user.js";
import {myContact} from "@/api/all.js";
import {getMain, mainExert} from "@/api/staff.js";

const route = useRoute()
const maintenance = ref([
  {
    type: '1',
    id: '1234',
    staff: '',
    process: '待处理',
    content: '客厅外的阳台被封窗，与客厅连为一体，这样的设计不仅拓宽了室内空间，也让阳光和新鲜空气能够更加自由地进入整个房间；\n' +
        '\n' +
        '客厅和餐厅的连通设计，使整个居住空间显得更加宽敞和开阔，简洁的装修风格在这里得到了完美的呈现，既实用又美观。\n' +
        '\n' +
        '将两个卧室和卫生间的门洞改到客厅的侧面墙上，这样的布局调整让卫生间的空间更加宽敞，也使整个房间的动线更加合理。这样的设计优化了空间利用率，提升了居住的舒适度。'
  },
  {
    type: '2'
  }
])

const staff = ref({
  name: '丘俊杰',
  id: '2022141460001',
  contact: 'wx:mx11224qiu',
  password: '123456'
})

staff.value.id = route.query.id

function getInfo() {
  getUserInfo().then(res => {
    staff.value = res.data.records
  })
}

getInfo();
const resetPassword = ref(false)
const oldPassword = ref('')//旧密码
const newPassword = ref('')//新密码
const newAgainPassword = ref('') //再次输入新密码

const formLabelWidth = '140px'

const solveContact = () => {
  myContact(staff.value.contact).then(res => {
    if (res.data.message)
      ElMessage({
        message: '保存成功！',
        type: 'success'
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
  if (oldPassword.value !== staff.value.password) {
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
const getMyMainExert = () => {
  getMain('待处理').then(res => {
    maintenance.value = res.data.records
  })
}
const lookContent = ref({
  isLook: false,
  content: 'wufjal'
})
const lookLook = (content) => {
  lookContent.value.content = content
  lookContent.value.isLook = true
}
const makeMain = (id) => {
  mainExert(id).then(res => {
    ElMessage({
      message: '处理成功',
      type: 'success'
    })
    getMyMainExert()
  })
}

getMyMainExert()
</script>

<template>
  <div>
    <el-table :data="maintenance" border style="width: 100%;">
      <el-table-column prop="type" label="维修项目" max-width="150"/>
      <el-table-column prop="location" label="地点" max-width="150"/>
      <el-table-column prop="dormitory" label="分配人ID" width="180"/>
      <el-table-column label="操作" width="280">
        <template #default="{row}">
          <el-form :inline="true">
            <el-form-item>
              <el-button @click="lookLook(row.content)">查看内容</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="makeMain(row.id)">已处理</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="lookContent.isLook" title="维修具体内容" width="500" center>
      <template #footer>
        <div class="dialog-footer">
          <el-form>
            <el-form-item>
              <el-text style="text-align: left">{{ lookContent.content }}</el-text>
            </el-form-item>
            <el-button type="primary" @click="lookContent.isLook=false">确认</el-button>
          </el-form>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>