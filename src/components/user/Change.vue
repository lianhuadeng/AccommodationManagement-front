<script setup>
import {ref} from "vue";
import {checkSubmit, getUserInfo, roomPageList} from "@/api/user.js";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const route = useRoute()

const stu = ref(getUserInfo(route.query.id))

const query = ref({
  type:'',
  park: '',
  building: '',
  floor: '',
  room: '',
  bed: '',
  remark:'',
  changeId:'',
  outRoom:''
})
const rooms = ref({
  parks: ['f','24','24'],
  buildings: ['t','g','h'],
  floors: ['t','g','h'],
  rooms:['t','g','h'],
  beds: ['t','g','h']
})
const getRoomList = () => {
  roomPageList(query.value).then(res => {
    rooms.value = res.data.records()
  })
}

const selectChange1 = ()=>{
  getRoomList()
  query.value.building=''
  query.value.floor=''
  query.value.room=''
  query.value.bed=''
}

const selectChange2 = ()=>{
  getRoomList()
  query.value.floor=''
  query.value.room=''
  query.value.bed=''
}

const selectChange3 = ()=>{
  getRoomList()
  query.value.room=''
  query.value.bed=''
}

const selectChange4 = ()=>{
  getRoomList()
  query.value.bed=''
}

const onSubmit = () =>{
  checkSubmit(stu.value.id).then(res=>{
    if(res.data){
      ElMessage({
        message: '你已有尚未完成的申请！',
        type: 'error',
      })
    }
    else{
      try
      {
        makeSubmit(query).then(res => {
          if (res.data) {
            ElMessage({
              message: '已提交申请！',
              type: 'success',
            })
          } else {
            ElMessage({
              message: '提交失败！',
              type: 'error',
            })
          }
        })
      }catch{
        ElMessage({
          message: '提交失败！',
          type: 'error',
        })
      }
    }
  })
}


getRoomList()
</script>

<template>
  <div>
    <el-form
        label-width="auto"
        :model="query"
        label-position="left"
    >
      <el-form-item label="操作：" label-position="left">
        <el-select v-model="query.type" placeholder="选择操作" style="max-width: 100px">
          <el-option
              v-for="op in ['普通入住','普通调整','学生互换','个人退宿','校外住宿','我的申请']"
              :key="op"
              :label="op"
              :value="op"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="query.type==='普通入住'||query.type==='普通调整'">
        <el-form @click="getRoomList" :inline="true" :model="query" class="demo-form-inline">
          <el-form-item label="选择入住位置：">
            <el-select @change="selectChange1" v-model="query.park" placeholder="选择园区" style="width: 240px">
              <el-option
                  v-for="park in rooms.parks"
                  :key="park"
                  :label="park"
                  :value="park"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select @change="selectChange2" v-model="query.building" placeholder="选择楼栋" style="width: 240px">
              <el-option
                  v-for="park in rooms.buildings"
                  :key="park"
                  :label="park"
                  :value="park"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select @change="selectChange3" v-model="query.floor" placeholder="选择楼层" style="width: 240px">
              <el-option
                  v-for="park in rooms.floors"
                  :key="park"
                  :label="park"
                  :value="park"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select @change="selectChange4" v-model="query.room" placeholder="选择房间" style="width: 240px">
              <el-option
                  v-for="park in rooms.rooms"
                  :key="park "
                  :label="park"
                  :value="park"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select @change="getRoomList" v-model="query.bed" placeholder="选择床位" style="width: 240px">
              <el-option
                  v-for="park in rooms.beds"
                  :key="park "
                  :label="park"
                  :value="park"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item v-if="query.type==='学生互换'" >
        请输入对方学号：
        <el-input style="max-width: 200px" v-model="query.changeId" type="text"></el-input>
      </el-form-item>
      <el-form-item v-if="query.type==='校外住宿'" >
        请输入校外住址：
        <el-input style="max-width: 200px" v-model="query.changeId" type="text"></el-input>
      </el-form-item>
      <el-form-item v-if="query.type!==''&&query.type!=='null'&&query.type!=='我的申请'">
        备注：
        <el-input
            v-model="query.remark"
            :rows="5"
            type="textarea"
            placeholder="Please input"
        />
      </el-form-item>
      <el-form-item v-if="query.type!==''&&query.type!=='null'&&query.type!=='我的申请'">
        <el-button type="primary" @click="onSubmit">
          提交申请
        </el-button>
      </el-form-item>
      <el-form></el-form>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
</style>