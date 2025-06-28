<script setup>
import {ref} from "vue";
import {InfoFilled, UploadFilled} from '@element-plus/icons-vue'
import {addUser} from "@/api/sys.js";
import {ElMessage} from "element-plus";

const op = ref('')
const users = ref([
  {
    type: '学生',
    id: '1'
  },
  {
    type: '宿舍管理员',
    id: '2'
  },
  {
    type: '分管领导',
    id: '3'
  }])
const user = ref({
  type: '',
  id: ''
})
const newUser = ref({
  name: '1',
  id: '1',
  password: '1'
})
const type = ref([
  {
    text: '学生',
    value: '学生'
  },
  {
    text: '宿舍管理员',
    value: '宿舍管理员'
  },
  {
    text: '分管领导',
    value: '分管领导'
  }])

const filterType = (value, row) => {
  return row.type === value
}
const excelUrl = ref('')

const handleAvatarSuccess = (response, uploadFile) => {
  excelUrl.value = URL.createObjectURL(uploadFile.raw)
}

const newRules = {
  name: [
    {required: true, message: '请输入姓名', trigger: 'blur'}],
  id: [{required: true, message: '请输入ID', trigger: 'blur'}],
  password: [{required: true, message: '请输入密码', trigger: 'blur'},]
}

const makeNewUser = () => {
  addUser(newUser).then(res => {
    ElMessage({
      message: '添加成功',
      type: 'success'
    })
  })
}
const makeCancelUser=()=>{

}

</script>

<template>
  <div>
    <el-radio-group v-model="op">
      <el-radio-button label="添加用户" value="添加用户"/>
      <el-radio-button @click="newUser=null" label="批量导入" value="批量导入"/>
    </el-radio-group>
    <el-form v-if="op==='添加用户'" :rules="newRules" :model="newUser">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="newUser.name"/>
      </el-form-item>
      <el-form-item label="ID" prop="id">
        <el-input v-model="newUser.id"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="newUser.password"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="makeNewUser" type="primary">提交</el-button>
      </el-form-item>
    </el-form>
    <el-upload v-else-if="op==='批量导入'"
               class="upload-demo"
               drag
               action=""
               multiple
    >
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        拖拽Excel文件到这里上传或者<em>点击上传</em>
      </div>
    </el-upload>
    <br>
    <el-table :data="users" border style="width: 100%;">
      <el-table-column prop="type" label="类型" width="180" :filters="type" :filter-method="filterType"/>
      <el-table-column prop="id" label="ID" width="180"/>
      <el-table-column>
        <el-button type="warning">修改</el-button>
        <el-popconfirm
            width="220"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="Are you sure to delete this?"
        >
          <template #reference>
            <el-button type="danger">删除</el-button>
          </template>
          <template #actions="{ makeCancelUser}">
            <el-button>取消</el-button>
            <el-button
                type="danger"
                @click="makeCancelUser"
            >
              确定
            </el-button>
          </template>
        </el-popconfirm>
      </el-table-column>
    </el-table>

  </div>
</template>

<style scoped lang="scss">

</style>