<script setup>
import {
  Iphone,
  Location,
  User,
  List
} from '@element-plus/icons-vue'
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";

const route = useRoute()
// const emit = defineEmits(['setId'])

const stu = ref({
  name:'丘俊杰',
  id:'2022141460001',
  contact:'wx:mx11224qiu',
  location:'乐创园区翠竹楼6层628室3床',
  password:'123456'
})

stu.value.id = route.query.id

const resetPassword =ref(false)
const oldPassword=ref('' )//旧密码
const newPassword=  ref('')//新密码
const newAgainPassword=ref('') //再次输入新密码
const formLabelWidth = '140px'

const solveContact = ()=>{

}

const resetCheck = () =>{
  // resetPassword.value = false
  if(!oldPassword.value||!newPassword.value||!newAgainPassword.value){
    ElMessage({
      message:'请输入完整！',
      type:"error"
    })
    return
  }
  if(oldPassword.value !== stu.value.password){
    ElMessage({
      message:'旧密码错误！',
      type:"error"
    })
  }
  else if(newPassword.value!==newAgainPassword.value){
    ElMessage({
      message:'新密码不一致！',
      type:"error"
    })
  }
  else{
    ElMessage({
      message:'修改成功！',
      type:"success"
    })
    resetPassword.value = false

  }
}
const clearForm = ()=>{
  resetPassword.value = true
  oldPassword.value=''
  newPassword.value=''
  newAgainPassword.value=''
}
</script>

<template>
  <div>
    <el-descriptions
        class="margin-top"
        title="个人信息"
        :column="1"
        :size="'large'"
        border
    >
      <template #extra>
        <el-button @click="solveContact" type="primary">保存</el-button>
        <el-button @click="clearForm" type="danger">修改密码</el-button>

        <el-dialog v-model="resetPassword" title="修改密码" width="500" center>
          <template #footer>
            <div class="dialog-footer">
              <el-form>
                <el-form-item label="旧密码" :label-width="formLabelWidth">
                  <el-input type="text" v-model="oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth">
                  <el-input type="password" v-model="newPassword" autocomplete="off" ></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" :label-width="formLabelWidth">
                  <el-input type="password" v-model="newAgainPassword" autocomplete="off" ></el-input>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="resetCheck">确认</el-button>
              <el-button @click="resetPassword = false">取消</el-button>
            </div>
          </template>
        </el-dialog>
      </template>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon >
              <user/>
            </el-icon>
            姓名
          </div>
        </template>
        {{stu.name}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <iphone/>
            </el-icon>
            联系方式
          </div>
        </template>
      <el-input v-model="stu.contact" type="text" placeholder="请输入具体的联系方式，如wx：mx11224qiu"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <List/>
            </el-icon>
            学号
          </div>
        </template>
        {{stu.id}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <Location/>
            </el-icon>
            宿舍位置
          </div>
        </template>
        {{stu.location}}
      </el-descriptions-item>
    </el-descriptions>
  </div>

</template>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}

.cell-item {
  display: flex;
  align-items: center;
}

.margin-top {
  margin-top: 20px;
}
</style>