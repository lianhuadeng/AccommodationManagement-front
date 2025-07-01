<script setup>
import {ref} from "vue";
import {addDiscipline, getMyBuilding} from "@/api/dormitory.js";
import {ElMessage} from "element-plus";

const ruleFormRef = ref();
const newRecord = ref({
  studentId: null,
  reason: null
})
const floorNum = ref()

const clearRecord = ()=>{
  newRecord.value={
    studentId: null,
    reason: null
  }
}

const newRecordRules = {
  studentId: [{required: true, message: '请输入学生ID', trigger: 'blur'}],
  reason: [{required: true, message: '请输入违纪行为', trigger: 'blur'}]
}
const makeNewRecord = () => {
  console.log(newRecord.value)
  addDiscipline(newRecord.value).then(res=>{
    if(res.status){
      ElMessage({
        message:res.message,
        type:'success'
      })
      clearRecord()
    }
    else{
      ElMessage({
        message:res.message,
        type:'error'
      })
    }
  })
}
clearRecord()
</script>

<template>
  <div>
    <el-form :rules="newRecordRules" :model="newRecord" ref="ruleFormRef"
             style="margin-top: 1vmin">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-form-item label="学生ID" prop="studentId">
            <el-input v-model="newRecord.studentId"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="扣分缘由：" prop="reason">
            <el-input :rows="5" type="textarea" v-model="newRecord.reason"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="makeNewRecord" type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">

</style>