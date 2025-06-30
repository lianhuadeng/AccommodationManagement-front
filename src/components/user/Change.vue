<script setup>
import {ref} from "vue";
import {
  getApplication,
  getLocationService,
} from "@/api/user.js";
import {ElMessage} from "element-plus";
import {getRoomListService} from "@/api/room.js";
import {getParkListService} from "@/api/park.js";
import {getBuildingListService, getFloorNumService} from "@/api/building.js";
import {bedPageListService} from "@/api/bed.js";
import {getApplicationListService, submitApplicationService} from "@/api/application.js";

const parkList = ref([])
const getParkList = async () => {
  query.value.buildingId = null
  query.value.floor = null
  query.value.roomId = null
  query.value.bedId = null
  const res = await getParkListService()
  parkList.value = res.data
}
const buildingList = ref([])
const getBuildingList = async () => {
  query.value.buildingId = null
  query.value.floor = null
  query.value.roomId = null
  selectedFloor.value = null
  query.value.bedId = null
  const res = await getBuildingListService(query.value.parkId)
  buildingList.value = res.data
}
const roomList = ref([])
const getRoomList = async () => {
  query.value.roomId = null
  query.value.bedId = null
  query.value.floor = selectedFloor.value
  const result = await getRoomListService(query.value)
  roomList.value = result.data
}
const bedList = ref([])
const getBedList = async () => {
  query.value.bedId = null
  const result = await bedPageListService(query.value)
  total.value = result.data.total
  bedList.value = result.data.items

}
const maxFloor = ref(0)
const selectedFloor = ref(null)
const getFloor = async () => {
  query.value.roomId = null
  selectedFloor.value = null
  query.value.bedId = null
  const result = await getFloorNumService(query.value.buildingId)
  query.value.floor = result.data
  maxFloor.value = query.value.floor
}
const query = ref({
  type: '普通入住',
  pageNum: 1,
  pageSize: 10,
  parkId: null,
  buildingId: null,
  floor: null,
  roomId: null,
  bedId: null,
  remark: null
})
const total = ref(0)
const pageNoChange = (value) => {
  query.value.pageNum = value
  getApplication()
}
const pageSizeChange = (value) => {
  query.value.pageSize = value
  getApplication()
}
const newApplicationData = ref({
  applicationType: null,
  targetPark: null,
  targetBuilding: null,
  targetRoom: null,
  targetBed: null,
  remark: null,
  newAddress: null
})
const userIdForExchange = ref()
const getLocationByUserId = async () => {
  const result = await getLocationService(userIdForExchange.value)
  newApplicationData.value.targetPark = result.data.parkId
  newApplicationData.value.targetBuilding = result.data.buildingId
  newApplicationData.value.targetRoom = result.data.roomId
  newApplicationData.value.targetBed = result.data.bedId
}

const applications = ref([])

const getApplicationList = async ()=>{
  const result = await getApplicationListService(query.value)
  if (result.status){
    total.value = result.data.total
    applications.value = result.data.items
  }else {
    ElMessage.error(result.message)
  }
}


const onSubmit = async () =>{
  newApplicationData.value.applicationType = query.value.type
  if (query.value.type === '普通入住' || query.value.type === '普通调整'){
    newApplicationData.value.targetPark = query.value.parkId
    newApplicationData.value.targetBuilding = query.value.buildingId
    newApplicationData.value.targetRoom = query.value.roomId
    newApplicationData.value.targetBed = query.value.bedId
  }else if (query.value.type === '学生互换'){
    await getLocationByUserId()
  }
  const result = await submitApplicationService(newApplicationData.value)
  if (result.status){
    ElMessage.success('提交成功')
  }else{
    ElMessage.error(result.message)
  }
}

const getStatusClass = (status) => {
  return {
    'status-pending': status === '待审核',
    'status-processing': status === '待处理',
    'status-completed': status === '已处理'
  }
}
getParkList()
getApplicationList()
</script>

<template>
  <div>
    <el-form
        label-width="auto"
        :model="query"
        label-position="left"
    >
      <el-form-item label="操作：" label-position="left">
        <el-select  v-model="query.type" placeholder="选择操作" style="max-width: 100px">
          <el-option
              v-for="op in ['普通入住','普通调整','学生互换','个人退宿','校外住宿','申请列表']"
              :key="op"
              :label="op"
              :value="op"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="query.type==='普通入住'||query.type==='普通调整'">
        <el-form :inline="true" :model="query" class="demo-form-inline">
          <el-form-item label="选择入住位置：">
            <el-select @change="getBuildingList" v-model="query.parkId" placeholder="选择园区" style="width: 240px">
              <el-option
                  v-for="park in parkList"
                  :key="park.parkId"
                  :label="park.name"
                  :value="park.parkId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select @change="getFloor" v-model="query.buildingId" placeholder="选择楼栋" style="width: 240px">
              <el-option
                  v-for="building in buildingList"
                  :key="building.buildingId"
                  :label="building.buildingId % 100"
                  :value="building.buildingId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select @change="getRoomList" v-model="selectedFloor" placeholder="选择楼层" style="width: 240px">
              <el-option
                  v-for="floor in maxFloor"
                  :key="query.floor"
                  :label="floor"
                  :value="floor"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select @change="getBedList" v-model="query.roomId" placeholder="选择房间" style="width: 240px">
              <el-option
                  v-for="room in roomList"
                  :key="room.roomId "
                  :label="room.roomId%10000"
                  :value="room.roomId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="query.bedId" placeholder="选择床位" style="width: 240px">
              <el-option
                  v-for="bed in bedList"
                  :key="bed.bedId"
                  :label="bed.bedId%100"
                  :value="bed.bedId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item v-if="query.type==='学生互换'" >
        请输入对方学号：
        <el-input style="max-width: 200px" v-model="userIdForExchange" type="number"></el-input>
      </el-form-item>
      <el-form-item v-if="query.type==='校外住宿'" >
        请输入校外住址：
        <el-input style="max-width: 200px" v-model="newApplicationData.newAddress" type="text"></el-input>
      </el-form-item>
      <el-form-item v-if="query.type!==''&&query.type!=='null'&&query.type!=='申请列表'">
        备注：
        <el-input
            v-model="newApplicationData.remark"
            :rows="5"
            type="textarea"
            placeholder="Please input"
        />
      </el-form-item>
      <el-form-item v-if="query.type!==''&&query.type!=='null'&&query.type!=='申请列表'">
        <el-button type="primary" @click="onSubmit">
          提交申请
        </el-button>
      </el-form-item>
      <el-form-item v-if="query.type==='申请列表'">
        <el-table :data="applications" border style="width: 100%;" >
          <el-table-column prop="applicationType" label="类型" max-width="150"/>
          <el-table-column prop="applicationId" label="申请ID" width="180"/>
          <el-table-column prop="targetPark" label="目标园区" max-width="150"/>
          <el-table-column prop="targetBuilding" label="目标楼栋" max-width="150" :formatter="(row, col, val) => val % 100"/>
          <el-table-column prop="targetRoom" label="目标房间" max-width="150" :formatter="(row, col, val) => val % 10000"/>
          <el-table-column prop="targetBed" label="目标床位" max-width="150" :formatter="(row, col, val) => val % 100"/>
          <el-table-column prop="newAddress" label="校外住宿" width="180"/>
          <el-table-column prop="remark" label="备注" width="180"/>
          <el-table-column prop="opinion" label="审核意见" width="180"/>
          <el-table-column prop="applicationTime" label="申请时间" width="180"/>
          <el-table-column prop="status" label="处理进度" max-width="150">
            <template #default="{ row }">
              <span :class="getStatusClass(row.status)">{{ row.status }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="query.pageNum"
            v-model:page-size="query.pageSize"
            :page-sizes="[5, 10, 15, 20]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="pageSizeChange"
            @current-change="pageNoChange"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.status-pending { color: #f56c6c; }
.status-processing { color:  #e6a23c; }
.status-completed { color: #67c23a; }
</style>