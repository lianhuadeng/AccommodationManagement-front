<script setup>
import {disciplinaryList, setScore} from "@/api/leader.js";
import {ref} from "vue";
import {ElMessage} from "element-plus";

const disList = ref([])
const query = ref({
  pageNum: '1',
  pageSize: '10',
  total: 0
})
//Todo:disList应该只包含未评分的记录



const score = ref(0)
const getDisciplinaryList = () => {
  disciplinaryList(query.value).then(res => {
    disList.value = res.data.items
    query.value.total = res.data.total
  })
}
const subScore = (record) => {
  setScore(record)
  score.value = 0
  getDisciplinaryList()
}
getDisciplinaryList()
</script>

<template>
  <el-table :data="disList" border style="width: 100%;">
    <el-table-column prop="dormitoryId" label="宿管ID"/>
    <el-table-column prop="studentId" label="学生ID"/>
    <el-table-column prop="reason" label="违纪缘由"/>
    <el-table-column label="扣分">
      <el-input  v-model="score" type="number" placeholder="请输入扣分"></el-input>
    </el-table-column>
    <el-table-column label="扣分操作">
      <template #default="{ row }">
        <el-button :disabled="score===null||score===0||score===''"
                   @click="subScore({disciplinaryId:row.disciplinaryId,score:parseInt(score)})" type="primary">确定
        </el-button>
      </template>
    </el-table-column>
  </el-table>

</template>

<style scoped lang="scss">

</style>