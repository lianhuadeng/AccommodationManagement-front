<script setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {getStudentDisciplinary} from "@/api/disciplinary.js";

const disList = ref([])
const getDisciplinaryList = async () => {
  const result = await getStudentDisciplinary()
  if (result.status) {
    disList.value = result.data
  } else {
    ElMessage.error(result.data)
  }
}
getDisciplinaryList()
</script>

<template>
  <div>
    <el-table :data="disList" border style="width: 100%;">
      <el-table-column prop="dormitoryName" label="登记宿管"/>
      <el-table-column prop="reason" label="违纪缘由"/>
      <el-table-column prop="score" label="扣分"/>
      <el-table-column prop="time" label="记录时间"/>

    </el-table>
  </div>
</template>

<style scoped lang="scss">

</style>