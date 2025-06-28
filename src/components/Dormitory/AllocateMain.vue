<script setup>

import {ref} from "vue";
import {useRoute} from "vue-router";
import {getStaffsList, mainAllocate} from "@/api/dormitory.js";
import {ElMessage} from "element-plus";

const route = useRoute()
const maintenance = ref([
  {
    id:'1',
    type:'水',
    staff:'10',
  },
  {
    id:'2',
    type:'水',
    staff:'11',
    process:'待处理'
  },
  {
    id:'3',
    type:'水',
    staff:'13',
    process:'已处理'
  }
])
const staffs = ref([
  {
    id:'1',
    name:'1',
    contact:'12'
  },
  {
    id:'2',
    name:'2',
    contact:'12'
  },
  {
    id:'3',

    name:'3',
    contact:'12'
  },
  {
    id:'4',
    name:'4',
    contact:'12'
  },
  {
    id:'5',
    name:'5',
    contact:'12'
  }
])

const makeMainExert = query=>{
  console.log(query)
  mainAllocate(query).then(res=>{
    ElMessage({
      message:'成功分配',
      type:'success'
    })
  })
}
const getStaffs = ()=>{
  getStaffsList().then(res=>{
    staffs.value = res.data.records
  })
}
getStaffs()
</script>

<template>
<div>
  <el-table v-model="maintenance" :data="maintenance" border style="width: 100%;">
    <el-table-column prop="userid" label="申请人id" max-width="150"/>
    <el-table-column prop="location" label="维修地点" max-width="150"/>
    <el-table-column prop="type" label="维修项目" max-width="150"/>
    <el-table-column label="维修人员" width="180">
      <template #default="{ row }">
      <el-select  v-model="row.staff" placeholder="选择人员" style="max-width: 100px">
        <el-option
            v-for="staff in staffs"
            :key="staff.id"
            :label="staff.name"
            :value="staff.id"
        />
      </el-select>
      </template>
    </el-table-column>
    <el-table-column label="操作" max-width="150">
    <template #default="{ row }">
      <el-button @click="makeMainExert({id:row.id,staff:row.staff})" type="primary">执行</el-button>
    </template>
  </el-table-column>
  </el-table>
</div>
</template>

<style scoped lang="scss">

</style>