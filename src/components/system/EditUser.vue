<script setup>
import {computed, ref} from "vue";
import {InfoFilled, UploadFilled} from '@element-plus/icons-vue'
import {addUserList, addUserService, userList} from "@/api/sys.js";
import {ElMessage, ElNotification} from "element-plus";
import axios from "axios";

const uploadRef = ref(null)
const userType = ref('')
const fileList = ref([])
const uploading = ref(false)
const uploadResult = ref(null)
const op = ref('添加用户')
const ruleFormRef = ref();
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
const multipleSelection = ref([])
const query = ref({
  pageNum: '2',
  pageSize: '10',
  total: 0
})
const newUser = ref({
  name: null,
  userId: null,
  password: null,
  college: null,
  major: null,
  grade: null,
  clazz: null,
  gender: null,
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


// 计算是否满足上传条件
const canUpload = computed(() => {
  return userType.value && fileList.value.length > 0
})

// 文件选择变化
const handleFileChange = (file) => {
  // 只允许一个文件
  fileList.value = [file]
}

// 文件移除
const handleFileRemove = () => {
  fileList.value = []
  uploadResult.value = null
}

// 上传前校验
const beforeUpload = (file) => {
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  const isExcel = validTypes.includes(file.type)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isExcel) {
    ElMessage.error('文件格式错误! 仅支持Excel文件 (xls/xlsx)')
    return false
  }

  if (!isLt10M) {
    ElMessage.error('文件大小不能超过10MB!')
    return false
  }

  return true
}

// 提交上传
const submitUpload = async () => {
  if (!canUpload.value) return

  const file = fileList.value[0].raw
  if (!file) {
    ElMessage.warning('请选择有效的文件')
    return
  }

  uploading.value = true
  uploadResult.value = null

  try {
    const formData = new FormData()
    console.log(file)
    formData.append('file', file)
    formData.append('userType', userType.value)

    const response = await addUserList(formData)

    if (response.data) {
      uploadResult.value = {
        title: '导入成功',
        type: 'success',
        message: response.data
      }
      ElNotification.success({
        title: '导入完成',
        message: response.data,
        duration: 5000
      })
    } else {
      uploadResult.value = {
        title: '导入失败',
        type: 'error',
        message: response.data || '未知错误'
      }
    }
  } catch (error) {
    let errorMessage = '上传失败'

    if (error.response) {
      const data = error.response.data
      if (data && data.message) {
        errorMessage = data.message
      } else {
        errorMessage = `服务器错误: ${error.response.status}`
      }
    } else if (error.request) {
      errorMessage = '网络错误，请检查连接'
    } else {
      errorMessage = error.message
    }

    uploadResult.value = {
      title: '导入失败',
      type: 'error',
      message: errorMessage
    }

    ElMessage.error(errorMessage)
  } finally {
    uploading.value = false
  }
}

// 重置上传状态
const resetUpload = () => {
  uploadRef.value?.clearFiles()
  fileList.value = []
  userType.value = ''
  uploadResult.value = null
}

const filterType = (value, row) => {
  return row.type === value
}

const newRules = {
  name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
  userId: [{required: true, message: '请输入ID', trigger: 'blur'}],
  type: [{required: true, message: '请选择类型', trigger: 'blur'}],
  college: [{required: true, message: '请输入学院', trigger: 'blur'}],
  major: [{required: true, message: '请输入专业', trigger: 'blur'}],
  grade: [{required: true, message: '请输入年级', trigger: 'blur'}],
  clazz: [{required: true, message: '请输入班级', trigger: 'blur'}],
  gender: [{required: true, message: '请输入性别', trigger: 'blur'}]

}

const makeNewUser = async () => {
  const valid = await ruleFormRef.value.validate()
      .then(() => true)
      .catch(() => false);
  if (!valid) {
    ElMessage.warning('请完善表单信息');
    return;
  }
  console.log(newUser.value)
  const result = await addUserService(newUser.value)
  if (result.status) {
    ElMessage.success(result.message)
  } else {
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
  query.value.pageNum = value
  getUserList()
}
const getUserList = () => {
  userList(query.value).then(res => {
    users.value = res.data.items
    // total.value = res.data.total
    query.value.total = res.data.total
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
    <el-form  v-if="op==='添加用户'" :rules="newRules" :model="newUser" ref="ruleFormRef" style="border:solid #AB3723 0.5vmin;margin-top: 1vmin">
      <el-row :gutter="20">
        <el-col :span="3">
      <el-form-item label="类型" prop="type">
        <el-select v-model="newUser.type" style="max-width: 40vmin">
          <el-option
              v-for="type in ['学生','教师','宿舍管理员','系统管理员','分管领导']"
              :key="type"
              :label="type"
              :value="type"
          />
        </el-select>
      </el-form-item>
        </el-col>
        <el-col :span="3">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="newUser.name" style="max-width: 40vmin"/>
      </el-form-item>
        </el-col>
        <el-col :span="3">
      <el-form-item label="ID" prop="userId">
        <el-input v-model="newUser.userId"/>
      </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
      <el-form-item label="学院" prop="college">
        <el-input v-model="newUser.college"/>
      </el-form-item>
        </el-col>
        <el-col :span="3">
        <el-form-item label="专业" prop="major">
        <el-input v-model="newUser.major"/>
      </el-form-item>
        </el-col>
        <el-col :span="2">
        <el-form-item label="年级" prop="grade">
        <el-input v-model="newUser.grade"/>
      </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
      <el-form-item label="班级" prop="clazz">
        <el-input v-model="newUser.clazz"/>
      </el-form-item>
        </el-col>
        <el-col :span="3">
        <el-form-item label="性别" prop="gender">
        <el-select v-model="newUser.gender" placeholder="请选择性别">
          <el-option label="男" value="男"/>
          <el-option label="女" value="女"/>
        </el-select>
      </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item>
        <el-button @click="makeNewUser" type="primary">提交</el-button>
      </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br>
    <div v-if="op==='批量导入'">
      <div style="display: flex; gap: 20px; margin-bottom: 20px">
        <el-select v-model="userType" placeholder="请选择用户类型" clearable style="flex: 1">
          <el-option label="学生" value="学生"/>
          <el-option label="教师" value="教师"/>
        </el-select>
      </div>
      <el-upload
          class="upload-demo"
          drag
          :auto-upload="false"
          :show-file-list="true"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          :before-upload="beforeUpload"
          :accept="'.xls,.xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
          :file-list="fileList"
          ref="uploadRef"
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">
          拖拽Excel文件到此处 或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持扩展名: .xls / .xlsx
          </div>
        </template>
      </el-upload>
      <div style="margin-top: 20px; display: flex; justify-content: center">
        <el-button
            type="primary"
            :loading="uploading"
            :disabled="!canUpload"
            @click="submitUpload"
        >
          开始导入
        </el-button>
        <el-button @click="resetUpload">重置</el-button>
      </div>

      <!-- 结果展示 -->
      <div v-if="uploadResult" style="margin-top: 30px">
        <el-alert :title="uploadResult.title" :type="uploadResult.type" show-icon>
          <div>{{ uploadResult.message }}</div>
          <div v-if="uploadResult.details" style="margin-top: 10px">
            <el-text type="info">{{ uploadResult.details }}</el-text>
          </div>
        </el-alert>
      </div>
    </div>
    <el-table :data="users" @selection-change="handleSelectionChange"
              border style="width: 100%;">
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="userId" label="ID"/>
      <el-table-column prop="type" label="类型" :filters="type" :filter-method="filterType"/>
      <el-table-column type="selection"/>
    </el-table>
    <el-pagination
        v-model:current-page="query.pageNo"
        v-model:page-size="query.pageSize"
        :page-sizes="[20,50,100,400]"
        :background="true"
        layout="总, sizes, prev, pager, next, jumper"
        :total="query.total"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
    />
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