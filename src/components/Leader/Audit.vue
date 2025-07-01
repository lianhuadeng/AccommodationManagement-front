<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {getToBeReviewedApplication, reviewApplicationService} from "@/api/application.js";

const reviewData = ref({
  applicationId: null,
  opinion: ''
})

const dialogVisible = ref(false)
const application = ref([])
const currentApplicationId = ref(null)
const getMyApplication = async () => {
  const result = await getToBeReviewedApplication()
  if (result.status){
    application.value = result.data
  }else{
    ElMessage.error(result.message)
  }
}

const reviewApplication = async (id) => {
  reviewData.value.applicationId = id
  const result = await reviewApplicationService(reviewData.value)
  if (result.status){
    ElMessage.success(result.message)
    cancel()
    await getMyApplication()
  }else {
    ElMessage.error(result.message)
  }
}

const cancel = () => {
  dialogVisible.value = false
  reviewData.value.opinion = ''
}
const reject = ( applicationId ) => {
  currentApplicationId.value = applicationId
  console.log(currentApplicationId.value)
  dialogVisible.value = true
}
getMyApplication()
</script>

<template>
  <div>
    <el-table :data="application" border style="width: 100%;">
      <el-table-column prop="applicationType" label="类型"/>
      <el-table-column prop="applierName" label="申请人" />
      <el-table-column prop="targetLocation" label="目标位置" />
      <el-table-column prop="applicationTime" label="申请时间" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="dormitoryAdminName" label="所属宿舍管理员" />
      <el-table-column label="操作" >
        <template #default="{ row }">
          <el-button @click="reviewApplication(row.applicationId)" type="primary">通过</el-button>
          <el-button @click="reject(row.applicationId)" type="danger">不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="审核意见" width="500" center :show-close=false :close-on-press-escape=false
               :close-on-click-modal=false @close="cancel">
      <template #footer>
        <div class="dialog-footer">
          <el-input
              v-model="reviewData.opinion"
              :rows="5"
              type="textarea"
              placeholder="请输入审核意见..."
          />
          <el-button type="primary" @click="reviewApplication(currentApplicationId)">确认</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<style scoped lang="scss">

</style>