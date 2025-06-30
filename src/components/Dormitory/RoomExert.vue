<script setup>
//TODO - update
import {ref} from "vue";
import {aplExert, getDorApl} from "@/api/dormitory.js";
import {useRoute} from "vue-router";
import {getUserInfo} from "@/api/user.js";
import {ElMessage} from "element-plus";

const route = useRoute()
const dor = ref({
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

const application = ref([])

const getMyApplication = ()=>{
  getDorApl(dor.value.id)
}

const makeAplExert = (id)=>{
  aplExert(id).then(res=>{
    ElMessage({
      message:'处理成功',
      type:'success'
    })
    getMyApplication()
  })
}
getMyApplication()
function getInfo() {
  getUserInfo().then(res => {
    dor.value = res.data.records
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
    <el-table-column label="操作" max-width="150">
      <template #default="{ row }">
      <el-button @click="makeAplExert(row.id)" type="primary">执行</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<style scoped lang="scss">

</style>