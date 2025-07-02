<script setup>
import {ref} from "vue";
import { useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {getToBeProcessedApplication, processApplicationService} from "@/api/application.js";

const router = useRouter()

const application = ref([])

const getMyApplication = async ()=>{
  const result = await getToBeProcessedApplication()
  if (result.status){
    application.value = result.data
  }else {
    ElMessage.error(result.message)
  }
}

const makeAplExert = async (id)=>{
  const result  = await processApplicationService(id)
  if (result.status){
    await getMyApplication()
    ElMessage.success(result.message)
  }else{
    ElMessage.error(result.message)
  }
}

getMyApplication()
</script>

<template>
<div>
  <el-table :data="application" border style="width: 100%;">
    <el-table-column prop="applicationType" label="申请类型" />
    <el-table-column prop="applierName" label="申请人" />
    <el-table-column prop="targetLocation" label="目标位置" />
    <el-table-column prop="applicationTime" label="申请时间" />
    <el-table-column prop="remark" label="备注" />
    <el-table-column prop="leaderName" label="审核人" />
    <el-table-column label="操作" >
      <template #default="{ row }">
      <el-button @click="makeAplExert(row.applicationId)" type="primary">处理完成</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<style scoped lang="scss">

</style>