<script setup>
import {ref} from "vue";
import {bedPageListService} from "@/api/bed.js";
import {getParkListService} from "@/api/park.js";
import {getBuildingListService, getFloorNumService} from "@/api/building.js";
import {getRoomListService} from "@/api/room.js";

const parkList = ref([])
const getParkList = async () => {
  query.value.buildingId = null
  query.value.floor = null
  query.value.roomId = null
  const res = await getParkListService()
  parkList.value = res.data
}
const buildingList = ref([])
const getBuildingList = async () => {
  query.value.buildingId = null
  query.value.floor = null
  query.value.roomId = null
  selectedFloor.value = null
  const res = await getBuildingListService(query.value.parkId)
  buildingList.value = res.data
}
const roomList = ref([])
const getRoomList = async () => {
  query.value.roomId = null
  query.value.floor = selectedFloor.value
  const result = await getRoomListService(query.value)
  roomList.value = result.data
}
const bedList = ref([])
const getBedList = async () => {
  const result = await bedPageListService(query.value)
  total.value = result.data.total
  bedList.value = result.data.items

}
const maxFloor = ref(0)
const selectedFloor = ref(null)
const getFloor = async () => {
  query.value.roomId = null
  selectedFloor.value = null
  const result = await getFloorNumService(query.value.buildingId)
  query.value.floor = result.data
  maxFloor.value = query.value.floor
}
const query = ref({
  pageNum: 1,
  pageSize: 10,
  parkId: null,
  buildingId: null,
  floor: null,
  roomId: null
})
const total = ref(0)
const pageNoChange = (value) => {
  query.value.pageNum = value
  getBedList()
}
const pageSizeChange = (value) => {
  query.value.pageSize = value
  getBedList()
}
const search = () => {
  query.value.pageNum = 1
  getBedList()
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
        <el-select v-model="query.roomId" placeholder="选择房间" style="width: 240px">
          <el-option
              v-for="room in roomList"
              :key="room.roomId "
              :label="room.roomId%10000"
              :value="room.roomId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="bedList" border style="width: 100%;">
      <el-table-column prop="parkName" label="园区"/>
      <el-table-column
          prop="buildingId"
          label="楼栋"
          :formatter="(row, col, val) => val % 100"
      />
      <el-table-column prop="floor" label="楼层"/>
      <el-table-column
          prop="roomId"
          label="房间"
          :formatter="(row, col, val) => val % 10000"
      />
      <el-table-column
          prop="bedId"
          label="床位"
          :formatter="(row, col, val) => val % 100"
      />
      <el-table-column prop="userName" label="所有者"/>
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