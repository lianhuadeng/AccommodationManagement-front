<script setup>
//TODO - Update
import {ref, watch} from "vue";
import {getFloorNumService, getManagedBuildingService} from "@/api/building.js";
import {ElMessage} from "element-plus";
import {getRoomListService} from "@/api/room.js";
import {addHygieneCheckService} from "@/api/hygieneCheck.js";

const building = ref({})
const getMyBuilding = async () => {
  const result = await getManagedBuildingService()
  if (result.status){
    building.value = result.data
    query.value.buildingId = building.value.buildingId
    query.value.parkId = building.value.parkId
  }else{
    ElMessage.error(result.message)
  }
}

const query = ref({
  parkId: null,
  buildingId: null,
  floor: null
})

const maxFloor = ref(0)
const selectedFloor = ref(null)

const getFloor = async () => {
  selectedFloor.value = null
  const result = await getFloorNumService(building.value.buildingId)
  maxFloor.value = result.data
}


const ruleFormRef = ref();
const newRecord = ref({
  roomId: null,
  score: 100,
  reason: null
})

const newRecordRules = {
  roomId: [{required: true, message: '请选择房间', trigger: 'blur'}],
  score: [
    {required: true, message: '请输入得分', trigger: 'blur'},
    {type:"number",min:1,max:100,message:'请输入正确的分数（1-100）',trigger: 'blur'}
  ],
  // 修改为动态验证规则
  reason: [{
    validator: (rule, value, callback) => {
      // 分数<100时必须填写理由
      if (newRecord.value.score < 100 && (!value || !value.trim())) {
        callback(new Error('请填写详细理由'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }]
}

const roomList = ref([])
const getRoomList = async () => {
  newRecord.value.roomId = null
  query.value.floor = selectedFloor.value
  const result = await getRoomListService(query.value)
  roomList.value = result.data
}

const makeNewRecord = async ()=>{
  const result = await addHygieneCheckService(newRecord.value)
  if (result.status) {
    ElMessage.success(result.message)
    clearData()
  } else {
    ElMessage.error(result.message)
  }
}

const clearData = () => {
  newRecord.value = {
    roomId: null,
    score: 100,
    reason: null
  }
  selectedFloor.value = null
}

const getData = async () => {
  await getMyBuilding()
  await getFloor()
}
// 添加分数变更监听
watch(() => newRecord.value.score, (newScore) => {
  // 分数变化时主动触发原因字段的验证
  if (ruleFormRef.value) {
    ruleFormRef.value.validateField('reason');
  }
})
getData()
</script>

<template>
  <div>
    <el-form :rules="newRecordRules" :model="newRecord" ref="ruleFormRef"
             style="margin-top: 1vmin">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-form-item label="楼层" prop="floor">
            <el-select @change="getRoomList" v-model="selectedFloor" style="max-width: 40vmin">
              <el-option
                  v-for="floor in maxFloor"
                  :key="floor"
                  :label="floor"
                  :value="floor"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="房间" prop="roomId">
            <el-select v-model="newRecord.roomId" style="max-width: 40vmin">
              <el-option
                  v-for="room in roomList"
                  :key="room.roomId "
                  :label="room.roomId%10000"
                  :value="room.roomId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="得分" prop="score">
            <el-input type="number" v-model.number="newRecord.score"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="扣分缘由：" prop="reason">
            <el-input :rows="5" type="textarea" v-model="newRecord.reason"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button @click="makeNewRecord" type="primary">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped lang="scss">

</style>