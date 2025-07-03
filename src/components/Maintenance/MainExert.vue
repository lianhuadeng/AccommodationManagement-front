<script setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {getMain, mainExert} from "@/api/staff.js";

const maintenances = ref([
])

const getMyMainExert = () => {
  getMain({status:'待维修'}).then(res => {
    maintenances.value = res.data
  })
}
const lookContent = ref({
  isLook: false,
  content: '发就发啦封建礼教'
})
const lookLook = (content) => {
  lookContent.value.content = content
  lookContent.value.isLook = true
}
const makeMain = (repairId) => {
  mainExert(repairId).then(res => {
    ElMessage({
      message: '处理成功',
      type: 'success'
    })
    getMyMainExert()
  })
}

getMyMainExert()
</script>

<template>
  <div>
    <el-table v-model="maintenances" :data="maintenances" border style="width: 100%; height: 85vh; overflow-y: auto;">
      <el-table-column prop="pictureUrl" label="图片详情">
        <template #default="{ row }">
          <el-image :src="row.pictureUrl" style="width: 60px; height: 60px;" fit="cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="studentId" label="申请人ID"/>
      <el-table-column prop="location" label="维修地点"/>
      <el-table-column prop="repairItem" label="维修项目"/>
      <el-table-column label="操作" width="280">
        <template #default="{row}">
          <el-form :inline="true">
            <el-form-item>
              <el-button @click="lookLook(row.content)">查看内容</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="makeMain(row.repairId)">已处理</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="无维修申请" />
      </template>
    </el-table>
    <el-dialog v-model="lookContent.isLook" title="维修具体内容" width="500" center>
      <template #footer>
        <div class="dialog-footer">
          <el-form>
            <el-form-item>
              <el-text style="text-align: left">{{ lookContent.content }}</el-text>
            </el-form-item>
            <el-button type="primary" @click="lookContent.isLook=false">确认</el-button>
          </el-form>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>