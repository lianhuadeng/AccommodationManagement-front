<script setup>
import {ref} from "vue";
import {addBuildingService, addParkService} from "@/api/sys.js";
import {ElMessage} from "element-plus";
import {getParkListService} from "@/api/park.js";

const op = ref('添加园区')
const ruleFormRef = ref();
const newAddPark = ref({
  name: '',
  type: '教师公寓',
  buildingNum: 0,
  floorNum: 0,
  roomNumPerFloor: 0,
  bedNumPerRoom: 0,
})
const newAddBuilding = ref({
  parkId: 0,
  floorNum: 0,
  roomNumPerFloor: 0,
  bedNumPerRoom: 0,
})
const parks = ref([])

const newParkRules = {
  name: [{required: true, message: '请输入园区名字', trigger: 'blur'}],
  type: [{required: true, message: '请选择类型', trigger: 'blur'}],
}
const newBuildingRules = {
  parkId: [{required: true, message: '请选择园区', trigger: 'blur'}]
}

const makeNewPark = async () => {
  const valid = await ruleFormRef.value.validate()
      .then(() => true)
      .catch(() => false);
  if (!valid) {
    ElMessage.warning('请完善表单信息');
    return;
  }
  addParkService(newAddPark.value).then(res => {
    if (res.status) {
      clearForm()
      ElMessage.success(res.message)
    } else {
      ElMessage.error(res.message)
    }
  })
}
const makeNewBuilding = async () => {
  const valid = await ruleFormRef.value.validate()
      .then(() => true)
      .catch(() => false);
  if (!valid) {
    ElMessage.warning('请完善表单信息');
    return;
  }
  console.log(newAddBuilding.value)
  addBuildingService(newAddBuilding.value).then(res => {
    if (res.status) {
      clearForm()
      ElMessage.success(res.message)
    } else {
      ElMessage.error(res.message)
    }
  })
}
const clearForm = () => {
  newAddPark.value.name = null
  newAddPark.value.type = '教师公寓'
  newAddPark.value.buildingNum = 0
  newAddPark.value.floorNum = 0
  newAddPark.value.roomNumPerFloor = 0
  newAddPark.value.bedNumPerRoom = 0
  newAddBuilding.value.parkId = null
  newAddBuilding.value.floorNum = 0
  newAddBuilding.value.roomNumPerFloor = 0
  newAddBuilding.value.bedNumPerRoom = 0
}


const getParkList = () => {
  getParkListService().then(res => {
    parks.value = res.data
  })
}
getParkList()

</script>

<template>
  <div>
    <el-radio-group v-model="op">
      <el-radio-button @click="clearForm" label="添加园区" value="添加园区"/>
      <el-radio-button @click="clearForm" label="添加楼栋" value="添加楼栋"/>
    </el-radio-group>
    <el-form v-if="op==='添加园区'" :rules="newParkRules" :model="newAddPark" ref="ruleFormRef"
             style="margin-top: 1vmin">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-form-item label="类型" prop="type">
            <el-select v-model="newAddPark.type" style="max-width: 40vmin">
              <el-option
                  v-for="type in ['教师公寓','男生公寓','女生公寓']"
                  :key="type"
                  :label="type"
                  :value="type"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="名字" prop="name">
            <el-input v-model="newAddPark.name" style="max-width: 40vmin"/>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="楼栋数" prop="buildingNum">
            <el-input v-model="newAddPark.buildingNum"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-form-item label="每栋楼层数" prop="floorNum">
            <el-input v-model="newAddPark.floorNum"/>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="每层房间数" prop="roomNumPerFloor">
            <el-input v-model="newAddPark.roomNumPerFloor"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="每房床位数" prop="bedNumPerRoom">
            <el-input v-model="newAddPark.bedNumPerRoom"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button @click="makeNewPark" type="primary">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-else-if="op==='添加楼栋'" :rules="newBuildingRules" :model="newAddBuilding" ref="ruleFormRef"
             style="margin-top: 1vmin">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-form-item label="园区" prop="parkId">
            <el-select v-model="newAddBuilding.parkId" style="max-width: 40vmin">
              <el-option
                  v-for="park in parks"
                  :key="park.parkId"
                  :label="park.name"
                  :value="park.parkId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="楼层数目" prop="floorNum">
            <el-input v-model="newAddBuilding.floorNum" style="max-width: 40vmin"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-form-item label="每楼房间数" prop="roomNumPerFloor">
            <el-input v-model="newAddPark.roomNumPerFloor"/>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="每房床位数" prop="bedNumPerRoom">
            <el-input v-model="newAddBuilding.bedNumPerRoom"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button @click="makeNewBuilding" type="primary">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<style scoped lang="scss">
.upload-demo {
  margin-top: 20px;
}

.el-upload__tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}
</style>