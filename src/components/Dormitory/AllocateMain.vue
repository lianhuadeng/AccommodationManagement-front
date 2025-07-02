<script setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {allocateRepairService, getToBeAllocatedRepairService} from "@/api/repair.js";
import {getMaintenanceAdminListService} from "@/api/user.js";
import {useRouter} from "vue-router";

const router = useRouter()
const maintenances = ref([])
const staffs = ref([])

const allocateData = ref({
  repairId: null,
  maintenanceId: null
})

const getStaffList = async ()=>{
  const result = await getMaintenanceAdminListService()
  if (result.status){
    staffs.value = result.data
  }else{
    ElMessage.error(result.message)
  }
}

const getMaintenanceList = async ()=>{
  const result = await getToBeAllocatedRepairService()
  if (result.status){
    maintenances.value = result.data
  }else{
    ElMessage.error(result.message)
  }
}

const allocate = async () =>{
  const result = await allocateRepairService(allocateData.value)
  if (result.status) {
    ElMessage.success(result.message)
    await getMaintenanceList()
  } else {
    ElMessage.error(result.message)
  }
}
const selectMaintenance = (repairId, maintenanceId) => {
  allocateData.value.maintenanceId = maintenanceId
  allocateData.value.repairId = repairId
}
getStaffList()
getMaintenanceList()
</script>

<template>
  <div>
    <el-table v-model="maintenances" :data="maintenances" border style="width: 100%;">
      <el-table-column prop="pictureUrl" label="图片详情">
        <template #default="{ row }">
          <el-image :src="row.pictureUrl" style="width: 60px; height: 60px;" fit="cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="applierName" label="申请人"/>
      <el-table-column prop="location" label="维修地点"/>
      <el-table-column prop="repairItem" label="维修项目"/>
      <el-table-column prop="content" label="维修详情"/>
      <el-table-column label="维修人员" width="180">
        <template #default="{ row }">
          <el-select v-model="row.maintenanceId" @change="selectMaintenance(row.repairId, row.maintenanceId)"
                     placeholder="选择人员" style="max-width: 100px">
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
        <el-button :disabled="allocateData.maintenanceId===null||allocateData.maintenanceId===''"  @click="allocate" type="primary">分配</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">

</style>