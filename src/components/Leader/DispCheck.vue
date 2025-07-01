<script setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {getToBeRateDisciplinary, setScore} from "@/api/disciplinary.js";

const disList = ref([])

const getDisciplinaryList = async () => {
  const result = await getToBeRateDisciplinary()
  if (result.status) {
    disList.value = result.data
  } else {
    ElMessage.error(result.message)
  }
}
const subScore = async (record) => {
  const result = await setScore(record)
  if (result.status) {
    await getDisciplinaryList()
    ElMessage.success(result.message)
  } else {
    ElMessage.error(result.message)
  }
}
getDisciplinaryList()
</script>

<template>
  <el-table :data="disList" border style="width: 100%;">
    <el-table-column prop="dormitoryName" label="所属宿管"/>
    <el-table-column prop="studentName" label="违纪人"/>
    <el-table-column prop="reason" label="违纪缘由"/>
    <el-table-column prop="location" label="违纪寝室"/>
    <el-table-column prop="time" label="记录时间"/>
    <el-table-column label="扣分">
      <template #default="{ row }">
        <el-input v-model.number="row.score" type="number" placeholder="请输入扣分"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="扣分操作">
      <template #default="{ row }">
        <el-button :disabled="row.score===null||row.score===0||row.score===''"
                   @click="subScore({disciplinaryId:row.disciplinaryId,score:row.score})" type="primary">确定
        </el-button>
      </template>
    </el-table-column>
  </el-table>

</template>

<style scoped lang="scss">

</style>