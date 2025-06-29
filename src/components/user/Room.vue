<script setup>
import {ref} from "vue";
import {bedPageListService} from "@/api/bed.js";
import {getParkListService} from "@/api/park.js";
import {getBuildingListService, getFloorNumService} from "@/api/building.js";
import {getRoomListService} from "@/api/room.js";

const parkList = ref([])
const getParkList = async () => {
  const res = await getParkListService()
  parkList.value = res.data
}
const buildingList = ref([])
const getBuildingList = async () => {
  const res = await getBuildingListService(query.value.parkId)
  buildingList.value = res.data
}
const roomList = ref([])
const getRoomList = async () => {
  const result = await getRoomListService(query.value)
  roomList.value = result.data
}
const getFloor = async () => {
  const result = await getFloorNumService(query.value.buildingId)
  query.value.floor = result.data
}
const query = ref({
  pageNum: 1,
  pageSize: 10,
  parkId: null,
  buildingId: null,
  floor: null,
  roomId: null
})
const rooms = ref([
  query.value, query.value, query.value
])
const pageNoChange = (value) => {
  query.value.pageNo = value
  getRoomList()
}
const pageSizeChange = (value) => {
  query.value.pageSize = value
  getRoomList()
}

// const getRoomList = async () => {
//   bedPageListService(query.value).then(res => {
//     rooms.value = res.data.records()
//     query.value.total = res.data.total
//   })
// }
const clearQuery = () => {
  query.value = {
    pageNum: 1,
    pageSize: 10,
    parkId: null,
    buildingId: null,
    floor: null,
    roomId: null
  }
}
getParkList()
</script>

<template>
  <div>
    <el-form :inline="true" :model="query" class="demo-form-inline">
      <el-form-item>
        <el-select @change="getBuildingList"
                   v-model="query.parkId" placeholder="选择园区" style="width: 240px">
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
        <el-select @change="getRoomList" v-model="query.floor" placeholder="选择楼层" style="width: 240px">
          <el-option
              v-for="floor in query.floor"
              :key="query.floor"
              :label="floor"
              :value="query.floor"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select change v-model="query.room" placeholder="选择房间" style="width: 240px">
          <el-option
              v-for="park in query.room"
              :key="park "
              :label="park"
              :value="park"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getRoomList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="rooms" border style="width: 100%;">
      <el-table-column prop="park" label="园区" width="180"/>
      <el-table-column prop="building" label="楼栋" width="180"/>
      <el-table-column prop="floor" label="楼层" width="180"/>
      <el-table-column prop="room" label="房间" width="180"/>
      <el-table-column prop="bed" label="床位" width="180"/>
    </el-table>
    <el-pagination
        v-model:current-page="query.pageNo"
        v-model:page-size="query.pageSize"
        :page-sizes="[5, 10, 15, 20]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="query.total"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
    />
  </div>
</template>

<style scoped lang="scss">
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}

.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>