<script setup>
//TODO 楼栋分配宿管
import {computed, onMounted, ref, watch} from "vue";
import {getHygiene, getUserInfoService} from "@/api/user.js";
import * as echarts from 'echarts';

const query = ref({
  pageNum: 1,
  pageSize: 30,
  total: 0,
  roomId: null
})
getUserInfoService().then(res => {
  query.value.roomId = res.data.roomId
})
const checkResult = ref([]);

getHygiene(query.value).then(res => {
  checkResult.value = res.data.items
  query.value.total = res.data.total
})


// 响应式数据
const timeRange = ref('recent7');
const chartInstance = ref(null);
const chartElement = ref(null);

// 计算属性
const sortedData = computed(() => {
  return [...checkResult.value].sort((a, b) =>
      new Date(b.checkTime) - new Date(a.checkTime))
});

const displayedData = computed(() => {
  const count = timeRange.value === 'recent7' ? 7 : 30;
  return sortedData.value.slice(0, count);
});

const chartData = computed(() => {
  return [...displayedData.value].sort((a, b) =>
      new Date(a.checkTime) - new Date(b.checkTime))
});

const avgScore = computed(() => {
  if (displayedData.value.length === 0) return 0;
  const total = displayedData.value.reduce((sum, item) => sum + item.score, 0);
  return total / displayedData.value.length;
});

// 方法
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-');
};

const initChart = () => {
  if (!chartElement.value) return;

  chartInstance.value = echarts.init(chartElement.value);
  updateChart();

  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  });
};

const updateChart = () => {
  if (!chartInstance.value) return;

  // 准备图表数据
  const dates = chartData.value.map(item => formatDate(item.checkTime));
  const scores = chartData.value.map(item => item.score);

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const data = params[0];
        const item = chartData.value[data.dataIndex];
        return `
              <div><strong>${data.name}</strong></div>
              <div>宿舍号: ${item.dormitoryId}</div>
              <div>房间号: ${item.roomId}</div>
              <div>得分: ${item.score}</div>
              <div>评价: ${item.reason}</div>
            `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '得分',
      min: 0,
      max: 100,
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '卫生得分',
        type: 'line',
        data: scores,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#3498db'
        },
        itemStyle: {
          color: '#fff',
          borderWidth: 2,
          borderColor: '#3498db'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: 'rgba(52, 152, 219, 0.3)'},
            {offset: 1, color: 'rgba(52, 152, 219, 0.1)'}
          ])
        },
        markLine: {
          silent: true,
          lineStyle: {
            color: '#e74c3c',
            type: 'dashed'
          },
          data: [
            {yAxis: 90, name: '优秀线'},
            {yAxis: 60, name: '合格线'}
          ]
        }
      }
    ]
  };

  chartInstance.value.setOption(option);
};

// 生命周期钩子
onMounted(() => {
  initChart();
});

// 监听数据变化
watch([() => checkResult, displayedData], () => {
  if (chartInstance.value) {
    updateChart();
  }
});

</script>

<template>
  <div>
    <div class="dashboard-controls">
      <el-radio-group v-model="timeRange" @change="updateChart">
        <el-radio-button label="recent7">最近7条记录</el-radio-button>
        <el-radio-button label="recent30">最近30条记录</el-radio-button>
      </el-radio-group>

      <div class="avg-score">
        <div class="avg-label">平均得分</div>
        <div class="avg-value">{{ avgScore.toFixed(1) }}</div>
      </div>
    </div>

    <div class="chart-container">
      <div ref="chartElement" style="width: 100%; height: 400px;"></div>
    </div>


    <el-table :data="checkResult" border style="width: 100%;">
      <el-table-column prop="roomId" label="房间号"/>
      <!--    <el-table-column prop="dormitoryName" label="登记宿管"/>-->
      <el-table-column prop="score" label="得分"/>
      <el-table-column prop="reason" label="扣分原因"/>
      <el-table-column prop="checkTime" label="记录时间"/>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.dashboard-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.avg-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  padding: 15px 25px;
  background: linear-gradient(135deg, #3498db, #2c80d0);
  color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.avg-label {
  font-size: 1rem;
  font-weight: 500;
}

.avg-value {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 5px;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #eee;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .dashboard-controls {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .avg-score {
    width: 100%;
    margin-top: 15px;
  }

  .chart-container {
    padding: 15px;
  }
}
</style>