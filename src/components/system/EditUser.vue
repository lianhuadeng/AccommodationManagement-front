<script setup>
import {ref} from "vue";
import {InfoFilled, UploadFilled} from '@element-plus/icons-vue'
import {addUserService, userList} from "@/api/sys.js";
import {ElMessage} from "element-plus";

const op = ref('添加用户')
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
const multipleSelection = ref([])
const query = ref({
  pageNum: '1',
  pageSize: '10',
  total: '100',
})
const newUser = ref({
  name: null,
  userId: null,
  password: null,
  college: null,
  major: null,
  grade: null,
  clazz: null,
  type: '学生'
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

const newRules = {
  name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
  id: [{required: true, message: '请输入ID', trigger: 'blur'}],
  type: [{required: true, message: '请选择类型', trigger: 'blur'}],
  college: [{required: true, message: '请输入学院', trigger: 'blur'}],
  major: [{required: true, message: '请输入专业', trigger: 'blur'}],
  grade: [{required: true, message: '请输入年级', trigger: 'blur'}]
}

const makeNewUser = async () => {
  console.log(newUser.value)
  const  result = await addUserService(newUser.value)
  if (result.status){
    ElMessage.success(result.message)
  }else {
    ElMessage.error(result.message)
  }
}

const handleSelectionChange = (userSelect) => {
  multipleSelection.value = userSelect
  console.log(multipleSelection.value)
}
const pageSizeChange = (value) => {
  query.value.pageSize = value
  getUserList()
}
const pageNoChange = (value) => {
  query.value.pageNo = value
  getUserList()
}
const getUserList = ()=>{
 userList(query.value).then(res=>{
   users.value = res.data
   // query.value.total=res.data.total
 })
}
getUserList()

</script>

<template>
  <div>
    <el-radio-group v-model="op">
      <el-radio-button label="添加用户" value="添加用户"/>
      <el-radio-button @click="newUser={type:'学生'}" label="批量导入" value="批量导入"/>
    </el-radio-group>
    <el-form v-if="op==='添加用户'" :rules="newRules" :model="newUser">
      <el-form-item label="类型" prop="type" max-w-80>
        <el-select v-model="newUser.type">
          <el-option
              v-for="type in ['学生','教师','宿舍管理员','系统管理员','分管领导']"
              :key="type"
              :label="type"
              :value="type"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="newUser.name"/>
      </el-form-item>
      <el-form-item label="ID" prop="id">
        <el-input v-model="newUser.userId"/>
      </el-form-item>
      <el-form-item label="学院" prop="college">
        <el-input v-model="newUser.college"/>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input v-model="newUser.major"/>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-input v-model="newUser.grade"/>
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
    <el-table :data="users"  @selection-change="handleSelectionChange"
              border style="width: 100%;">
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="type" label="类型"  :filters="type" :filter-method="filterType"/>
      <el-table-column type="selection"/>
    </el-table>
<!--    <el-pagination-->
<!--        v-model:current-page="query.pageNo"-->
<!--        v-model:page-size="query.pageSize"-->
<!--        :page-sizes="[20,50,100,400]"-->
<!--        :background="true"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="query.total"-->
<!--        @size-change="pageSizeChange"-->
<!--        @current-change="pageNoChange"-->
<!--    />-->
  </div>
</template>

<style scoped lang="scss">

</style>