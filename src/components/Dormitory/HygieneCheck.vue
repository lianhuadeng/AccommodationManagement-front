<script setup>
//TODO - Update
import {ref} from "vue";
import {getMyBuilding} from "@/api/dormitory.js";

const ruleFormRef = ref();
const newRecord = ref({
  roomId: null,
  score: 100,
  reason: null
})
const floorNum = ref()
const roomList = ref([])

const newRecordRules = {
  roomId: [{required: true, message: '请选择房间', trigger: 'blur'}],
  score: [{required: true, message: '请输入得分', trigger: 'blur'},
          {min:1,max:100,message:'请输入正确的分数（1-100）',trigger: 'blur'}],
  reason: [{required: true, message: '请输入扣分理由', trigger: 'blur'}]
}
const building = ref({})
const getMyRoomList = () => {
   getMyBuilding().then(res=>{
     // console.log(res)
    building.value = res.data[0]
     floorNum.value=building.value.floorNum
  })
}
const makeNewRecord = ()=>{

}
getMyRoomList()
</script>

<template>
  <div>
    <el-form :rules="newRecordRules" :model="newRecord" ref="ruleFormRef"
             style="margin-top: 1vmin">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-form-item label="楼层" prop="floor">
            <el-select v-model="newRecord.floor" style="max-width: 40vmin">
              <el-option
                  v-for="floor in floorNum"
                  :key="floor"
                  :label="floor"
                  :value="floor"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="房间" prop="studentId">
            <el-select v-model="newRecord.studentId" style="max-width: 40vmin">
              <el-option
                  v-for="floor in roomList"
                  :key="floor"
                  :label="floor"
                  :value="floor"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="得分" prop="score">
            <el-input v-model="newRecord.score"/>
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