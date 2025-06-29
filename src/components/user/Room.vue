<script setup>
import { ref} from "vue";
import {roomPageList} from "@/api/user.js";

const query = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  park:'p',
  building:'b',
  floor:'f',
  room:'r',
  bed:'b'
})
const rooms=ref([
  query.value,query.value,query.value
])
const pageNoChange = (value) => {
  query.value.pageNo = value
  getRoomList()
}
const pageSizeChange = (value) => {
  query.value.pageSize = value
  getRoomList()
}
const getRoomList = () => {
  roomPageList(query.value).then(res => {
    rooms.value = res.data.records
    query.value.total = res.data.total
  })
}

getRoomList()

</script>

<template>
  <div>
    <el-form :inline="true" :model="query" class="demo-form-inline">
      <el-form-item>
        <el-select change v-model="query.park" placeholder="选择园区" style="width: 240px">
          <el-option
              v-for="park in query.parks"
              :key="park"
              :label="park"
              :value="park"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select change v-model="query.building" placeholder="选择楼栋" style="width: 240px">
          <el-option
              v-for="park in query.building"
              :key="park"
              :label="park"
              :value="park"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select change v-model="query.floor" placeholder="选择楼层" style="width: 240px">
          <el-option
              v-for="park in query.floor"
              :key="park"
              :label="park"
              :value="park"
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

    <el-table :data="rooms" border style="width: 100%;" >
      <el-table-column prop="park" label="园区" width="180"/>
      <el-table-column prop="building" label="楼栋" width="180"/>
      <el-table-column prop="floor" label="楼层" width="180"/>
      <el-table-column prop="room" label="房间" width="180"/>
      <el-table-column prop="bed" label="床位" width="180"/>
    </el-table>
    <el-pagination
        v-model:current-page="query.pageNo"
        v-model:page-size="query.pageSize"
        :page-sizes="[100, 200, 300, 400]"
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