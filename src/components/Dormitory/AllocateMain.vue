<script setup>
//TODO - Update
import {ref} from "vue";
import {useRoute} from "vue-router";
import { mainAllocate} from "@/api/dormitory.js";
import {ElMessage} from "element-plus";
import {getStaffList, maintenanceList} from "@/api/maintenance.js";

const maintenances = ref([])
const staffs = ref([])
getStaffList().then(res=>{
  console.log(res.data)
  staffs.value = res.data
})
const getMaintenanceList = ()=>{
  maintenanceList("待分配").then(res=>{
    console.log(res.data)
    maintenances.value=res.data
  })
}

const makeMainExert = query=>{
  console.log(query)
  mainAllocate(query).then(res=>{
    ElMessage({
      message:'成功分配',
      type:'success'
    })
    getMaintenanceList()
  })
}
getMaintenanceList()
</script>

<template>
<div>
  <el-table v-model="maintenances" :data="maintenances" border style="width: 100%;">
    <el-table-column prop="studentId" label="申请人id" />
    <el-table-column prop="location" label="维修地点" />
    <el-table-column prop="repairItem" label="维修项目"/>
    <el-table-column label="维修人员" width="180">
      <template #default="{ row }">
      <el-select  v-model="row.maintenanceId" placeholder="选择人员" style="max-width: 100px">
        <el-option
            v-for="staff in staffs"
            :key="staff.userId"
            :label="staff.name"
            :value="staff.userId"
        />
      </el-select>
      </template>
    </el-table-column>
    <el-table-column label="操作" max-width="150">
    <template #default="{ row }">
      <el-button v-if="row.maintenanceId!==null&&row.maintenanceId!==''" @click="makeMainExert({repairId:row.repairId,maintenanceId:row.maintenanceId})" type="primary">执行</el-button>
    </template>
  </el-table-column>
  </el-table>
</div>
</template>

<style scoped lang="scss">

</style>