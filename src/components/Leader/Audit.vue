<script setup>
import {ref} from "vue";
import {aplExert, getDorApl} from "@/api/dormitory.js";
import {useRoute} from "vue-router";
import {getUserInfo} from "@/api/user.js";
import {ElMessage} from "element-plus";
import {aplAudit, makeReject} from "@/api/leader.js";

const leader = ref({
  name: '丘俊杰',
  id: '2022141460001',
  contact: 'wx:mx11224qiu',
  park: '乐创',
  building: '翠竹',
  floor: '6',
  room: '628',
  bed: '3',
  password: '123456'
})
const reason = ref('')
const noPass = ref(false)

const application = ref([
  {
    id: '',
    type: '1',
    userId: '1234',
    process: '待审核'
  },
  {
    type: '2'
  }
])
let aplId
const getMyApplication = () => {
  getDorApl('待审核')
}

const makeAplAudit = (id) => {
  aplAudit(id).then(res => {
    ElMessage({
      message: '审核成功',
      type: 'success'
    })
    getMyApplication()
  })
}

const cancelReject = () => {
  noPass.value = false
  reason.value = ''
}

const rejectApl = (id) => {
  makeReject(id).then(res => {
    ElMessage({
      message: '执行成功',
      type: 'success'
    })
  })
}

const noPassApl = (id)=>{
  noPass.value=true
  aplId = id
}
getMyApplication()

function getInfo() {
  getUserInfo().then(res => {
    leader.value = res.data.records
  })
}

getInfo()
</script>

<template>
  <div>
    <el-table :data="application" border style="width: 100%;">
      <el-table-column prop="type" label="类型" max-width="150"/>
      <el-table-column prop="userId" label="申请人ID" width="180"/>
      <el-table-column prop="changeId" label="交换人ID" width="180"/>
      <el-table-column prop="park" label="园区" max-width="150"/>
      <el-table-column prop="building" label="楼栋" max-width="150"/>
      <el-table-column prop="floor" label="楼层" max-width="150"/>
      <el-table-column prop="room" label="房间" max-width="150"/>
      <el-table-column prop="bed" label="床位" max-width="150"/>
      <el-table-column prop="outRoom" label="校外住宿" width="180"/>
      <el-table-column prop="checkId" label="审核人ID" width="180"/>
      <el-table-column label="操作" min-width="100">
        <template #default="{ row }">
          <el-button @click="makeAplAudit(row.id)" type="primary">通过</el-button>
          <el-button @click="noPassApl(row.id)" type="danger">不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="noPass" title="拒绝备注" width="500" center :show-close=false :close-on-press-escape=false
               :close-on-click-modal=false>
      <template #footer>
        <div class="dialog-footer">
          <el-input
              v-model="reason"
              :rows="5"
              type="textarea"
              placeholder="请输入具体内容..."
          />
          <el-button type="primary" @click="rejectApl(aplId)">确认</el-button>
          <el-button @click="cancelReject">取消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<style scoped lang="scss">

</style>