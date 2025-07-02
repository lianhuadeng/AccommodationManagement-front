<script setup>
import {
  Iphone,
  User,
  List, Lock
} from '@element-plus/icons-vue'
import {computed, onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import * as echarts from 'echarts'
import {
  changePasswordService,
  getUserInfoService, getUserPageListService,
  updateContactService
} from "@/api/user.js";

const router = useRouter()

const sys = ref({
  name: null,
  id: null,
  contact: null,
  location: null
})
const kindNum = ref({
  '学生': 0,
  '教师': 0,
  '宿舍管理员': 0,
  '分管领导': 0,
  '系统管理员': 0,
  '维修管理员': 0
})

const sexRate = ref({
  '学生男': 0,
  '学生女': 0,
  '教师男': 0,
  '教师女': 0
})

const query = {
  pageNum: 1,
  pageSize: 1000,
  total: 0
}
// 准备数据
const categories = ref(Object.keys(kindNum.value))
const values = ref(Object.values(kindNum.value));
const getUserList = async () => {
  const result = await getUserPageListService(query)
  if (result.status) {
    for (let i = 0; i < result.data.items.length; i++) {
      kindNum.value[result.data.items[i].type]++
      sexRate.value[result.data.items[i].type + result.data.items[i].sex]++
    }
    categories.value = Object.keys(kindNum.value)
    values.value = Object.values(kindNum.value)
    initChart();

    console.log(values.value)
  } else {
    ElMessage.error(result.message)
  }
}

getUserList()

const getInfo = async () => {
  try {
    const result = await getUserInfoService();
    sys.value.id = result.data.userId
    sys.value.name = result.data.name
    sys.value.contact = result.data.contact
  } catch (error) {
    ElMessage.error("登录过期，请重新登录")
    await router.push('/login');
  }
}

getInfo();
// ----------修改密码--------------
const resetPassword = ref(false)
const changePasswordData = ref({
  oldPassword: null,
  newPassword: null,
  confirmPassword: null
})
const rules = {
  oldPassword: [
    {required: true, message: '请输入旧密码', trigger: 'blur'},
  ],
  newPassword: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码长度在 6 到 20 个非空字符', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
          callback(new Error('密码必须包含大小写字母和数字!'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {required: true, message: '请再次输入密码', trigger: 'blur'},
    {min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码!'))
        } else if (value !== changePasswordData.value.newPassword) {
          callback(new Error('两次输入的密码不一致!'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }
  ]
}

const changePassword = async () => {

  const result = await changePasswordService(changePasswordData.value);
  if (result.status) {
    ElMessage({
      message: result.message,
      type: 'success'
    })
    await router.push('/login');
  } else {
    ElMessage({
      message: result.message,
      type: 'error',
    });
  }
}
const formLabelWidth = '140px'

const updateContact = async () => {
  const result = await updateContactService(dor.value.contact);
  if (result.status) {
    await getInfo()
    ElMessage.success(result.message)
  } else {
    ElMessage.error(result.message)
  }
}

const clearForm = () => {
  changePasswordData.value.oldPassword = null
  changePasswordData.value.newPassword = null
  changePasswordData.value.confirmPassword = null
}


const totalUsers = computed(() => {
  return Object.values(kindNum.value).reduce((sum, num) => sum + num, 0);
});

// 图表实例
const numChart = ref(null);
const studentChartRef = ref(null);
const teacherChartRef = ref(null);


// 初始化图表
const initChart = () => {
  // if (!numChart.value) return;

  const chartInstance = echarts.init(numChart.value);
  const stuInstance = echarts.init(studentChartRef.value);
  const teaInstance = echarts.init(teacherChartRef.value);

  // 颜色数组
  const colors = [
    '#3498db', '#2ecc71', '#9b59b6',
    '#e67e22', '#1abc9c', '#e74c3c'
  ];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c} 人'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories.value,
      axisLabel: {
        interval: 0,
        rotate: 0,
        fontSize: 14,
        fontWeight: 'bold'
      },
      axisLine: {
        lineStyle: {
          color: '#7f8c8d'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '用户数量',
      nameTextStyle: {
        fontSize: 14,
        padding: [0, 0, 0, 20]
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#7f8c8d'
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '用户数量',
        type: 'bar',
        data: values.value.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index % colors.length]
          }
        })),
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          fontSize: 14,
          fontWeight: 'bold'
        },
        barWidth: '60%'
      }
    ],
    animation: true,
    animationDuration: 1500,
    animationEasing: 'elasticOut'
  };

  chartInstance.setOption(option);
  stuInstance.setOption({
    title: {
      text: '学生性别比例',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '学生性别',
        type: 'pie',
        radius: '50%',
        data: [
          {value: sexRate.value['学生男'], name: '男'},
          {value: sexRate.value['学生女'], name: '女'}
        ],
        color: ['#36CBCB', '#FF7E79']
      }
    ]
  })
  teaInstance.setOption({
    title: {
      text: '教师性别比例',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '教师性别',
        type: 'pie',
        radius: '50%',
        data: [
          {value: sexRate.value['教师男'], name: '男'},
          {value: sexRate.value['教师女'], name: '女'}
        ],
        color: ['#36CBCB', '#FF7E79']
      }
    ]
  })

  // 响应式调整
  window.addEventListener('resize', () => {
    chartInstance.resize();
    stuInstance.resize();
    teaInstance.resize();
  });
};

onMounted(() => {
  initChart();
});
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
        <el-button @click="updateContact" type="primary">保存</el-button>
        <el-button @click="resetPassword = true;" type="danger">修改密码</el-button>
        <el-dialog v-model="resetPassword" title="修改密码" width="500" center @close="clearForm">
          <template #footer>
            <div class="dialog-footer">
              <el-form :model="changePasswordData" :rules="rules">
                <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPassword">
                  <el-input :prefix-icon="Lock" type="text" v-model="changePasswordData.oldPassword" autocomplete="off"
                            placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth">
                  <el-input :prefix-icon="Lock" type="password" v-model="changePasswordData.newPassword"
                            autocomplete="off"
                            placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" :label-width="formLabelWidth">
                  <el-input :prefix-icon="Lock" type="password" v-model="changePasswordData.confirmPassword"
                            autocomplete="off"
                            placeholder="请再次输入密码"></el-input>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="changePassword">确认</el-button>
              <el-button @click="resetPassword = false">取消</el-button>
            </div>
          </template>
        </el-dialog>
      </template>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user/>
            </el-icon>
            姓名
          </div>
        </template>
        {{ sys.name }}
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
        <el-input v-model="sys.contact" type="text" placeholder="请输入具体的联系方式，如wx：mx11224qiu"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <List/>
            </el-icon>
            ID:
          </div>
        </template>
        {{ sys.id }}
      </el-descriptions-item>
    </el-descriptions>
    <div>
      <div class="chart-header">
        <h2>用户类型数量统计</h2>
        <p class="subtitle">系统内各类用户数量分布</p>
      </div>
      <div class="data-summary">
        <div class="total-users">
          <span class="total-label">用户总数</span>
          <span class="total-value">{{ totalUsers }}</span>
        </div>
      </div>

      <div class="chart-container">
        <div ref="numChart" style="width: 100%; height: 500px;"></div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div ref="studentChartRef" class="chart-container" style="width: 100%; height: 300px;"></div>
          </el-col>
          <el-col :span="12">
            <div ref="teacherChartRef" class="chart-container" style="width: 100%; height: 300px;"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style scoped>

.cell-item {
  display: flex;
  align-items: center;
}

.margin-top {
  margin-top: 20px;
}

.status-pending {
  color: #f56c6c;
}

.status-processing {
  color: #e6a23c;
}

.status-completed {
  color: #67c23a;
}
</style>