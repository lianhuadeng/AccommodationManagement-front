<script setup>


import {ref} from "vue";
import {useRoute} from "vue-router";
import {getUserInfo, makeMaiSubmit} from "@/api/user.js";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

const route = useRoute()

const options = [
  {
    value: '水',
    label: '水',
    children: [
      {
        value: '水龙头类',
        label: '水龙头类',
      },
      {
        value: '下水疏通类',
        label: '下水疏通类',
      },
      {
        value: '洗手（脸）池（盆）类',
        label: '洗手（脸）池（盆）类',
      },
      {
        value: '厕所感应器',
        label: '厕所感应器',
      },
      {
        value: '阀门开关类',
        label: '阀门开关类',
      },
      {
        value: '上下水管类',
        label: '上下水管类',
      },
      {
        value: '厕所洁具类',
        label: '厕所洁具类',
      },
      {
        value: '水表类',
        label: '水表类',
      },
      {
        value: '水箱类',
        label: '水箱类',
      },
      {
        value: '其他类别',
        label: '其他类别',
      }
    ]
  },
  {
    value: '木',
    label: '木',
    children:[
      {
        value: '门锁窗扣类',
        label: '门锁窗扣类',
      },
      {
        value: '门窗加固类',
        label: '门窗加固类',
      },
      {
        value: '桌椅类',
        label: '桌椅类',
      },
      {
        value: '床柜类',
        label: '床柜类',
      },
      {
        value: '纱窗玻璃类',
        label: '纱窗玻璃类',
      },
      {
        value: '毛巾架窗帘衣架类',
        label: '毛巾架窗帘衣架类',
      },
      {
        value: '其他类别',
        label: '其他类别',
      }
    ]
  },
  {
    value: '泥',
    label: '泥',
    children:[
      {
        value: '瓷砖、地砖类',
        label: '瓷砖、地砖类',
      },
      {
        value: '砖石类',
        label: '砖石类',
      },
      {
        value: '抹灰类',
        label: '抹灰类',
      },
      {
        value: '道路及排水类',
        label: '道路及排水类',
      },
      {
        value: '钢门窗、防盗门类',
        label: '钢门窗、防盗门类',
      },
      {
        value: '房屋漏水类',
        label: '房屋漏水类',
      },
      {
        value: '其他类别',
        label: '其他类别',
      }
    ]
  },
  {
    value: '漆',
    label: '漆',
    children:[
      {
        value: '墙皮脱落类',
        label: '墙皮脱落类',
      },
      {
        value: '油漆类',
        label: '油漆类',
      },
      {
        value: '玻璃类',
        label: '玻璃类',
      },
      {
        value: '其他类别',
        label: '其他类别',
      }
    ]
  },
  {
    value: '下水管道',
    label: '下水管道',
  },
  {
    value: '空调',
    label: '空调',
  },
  {
    value: '电',
    label: '电',
    children:[
      {
        value: '开关插座类',
        label: '开关插座类',
      },
      {
        value: '室内照明类',
        label: '室内照明类',
      },
      {
        value: '电表',
        label: '电表',
      },
      {
        value: '线路维修类',
        label: '线路维修类',
      },
      {
        value: '线管维修类',
        label: '线管维修类',
      },
      {
        value: '电器类',
        label: '电器类',
      },
      {
        value: '路灯类',
        label: '路灯类',
      },
      {
        value: '其他类别',
        label: '其他类别',
      }
    ]
  },
  {
    value: '其他',
    label: '其他',
    children:[
      {
        value: '街道路灯',
        label: '街道路灯',
      },
      {
        value: '热水管道',
        label: '热水管道',
      },
      {
        value: '热水计费器',
        label: '热水计费器',
      },
      {
        value: '开水器',
        label: '开水器',
      },
      {
        value: '热水机组',
        label: '热水机组',
      }
    ]
  }
]

const stu = ref({
  name: '丘俊杰',
  id: '2022141460001',
  contact: 'wx:mx11224qiu',
  park: '乐创',
  building: '翠竹',
  floor: '6',
  room: '628',
  bed: '3',
  password: '123456'
})

getUserInfo(route.query.id).then(res => {
  stu.value = res.data.records
})

const query = ref({
  location: stu.value.park + '园区' + stu.value.building + '楼' + stu.value.floor + '层' + stu.value.room + '室',
  content: '',
  type: ''
})

const beforeAvatarUpload= (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
}
const imageUrl = ref('')

const onSubmit = ()=>{
  makeMaiSubmit(query).then(res=>{
    ElMessage({
      message:'提交成功',
      type:'success'
    })
  })
}

</script>

<template>
  <div>
    <el-form
        label-width="auto"
        :model="query"
        label-position="left"
    >
      <el-form-item>
        请输入维修地址：
        <el-input :placeholder="stu.park+'园区'+stu.building+'楼'+stu.floor+'层'+stu.room+'室'"
                  style="max-width: 200px" v-model="query.location" type="text"></el-input>
      </el-form-item>
      <el-form-item label="维修项目：" label-position="left">
        <el-cascader-panel @change="console.log(query.type)" v-model="query.type" style="width: fit-content" :options="options"/>
      </el-form-item>
      <el-form-item>
        具体内容：
        <el-input
            v-model="query.content"
            :rows="5"
            type="textarea"
            placeholder="请输入具体内容..."
        />
      </el-form-item>
      <el-form-item>
        <el-upload
            class="avatar-uploader"
            action="/api/file/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
