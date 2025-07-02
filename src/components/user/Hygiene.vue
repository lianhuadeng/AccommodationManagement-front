<script setup>
//TODO 楼栋分配宿管
import {ref} from "vue";
import {getHygiene, getUserInfoService} from "@/api/user.js";
const query = ref({
  pageNum:1,
  pageSize:10,
  total:0,
  roomId:null
})
getUserInfoService().then(res=>{
  query.value.roomId = res.data.roomId
})
const checkResult = ref([]);

getHygiene(query.value).then(res=>{
  checkResult.value = res.data.items
  query.value.total = res.data.total
})


</script>

<template>
  <el-table :data="checkResult" border style="width: 100%;">
    <el-table-column prop="roomId" label="房间号"/>
<!--    <el-table-column prop="dormitoryName" label="登记宿管"/>-->
    <el-table-column prop="score" label="得分"/>
    <el-table-column prop="reason" label="扣分原因"/>
    <el-table-column prop="checkTime" label="记录时间"/>
  </el-table>
</template>

<style scoped lang="scss">

</style>