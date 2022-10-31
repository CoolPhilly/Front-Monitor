<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>异常类型</span>
      </div>
    </template>
    <ECharts :options="option" :width="'100%'" :height="'348px'"></ECharts>
  </el-card>
</template>

<script setup lang="ts">
import ECharts from '@/components/echarts/echarts.vue';
import { ref, watch } from 'vue'
import { getProjectErrorInfo, getProjectNetworkInfo } from "@/api/projectinfo"
import { getYearMonthDay } from "@/utils/timestampToTime"


const props = defineProps(['appid', 'date'])
// console.log(props, 'props');
const option = ref({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: '1%',
    left: 'center',
  },
  series: [
    {
      color: ['#80FFA5', '#00DDFF', '#37A2FF'],
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 0, name: 'JS异常' },
        { value: 0, name: '接口异常' },
        { value: 0, name: '资源异常' },
      ],
      animationType: 'scale',
      animationEasing: 'exponentialInOut',
      animationDelay: function () {
        return Math.random() * 100;
      },
    },
  ],
})



watch(props, async () => {
  // console.log(props);
  // 获取项目错误信息
 
  let parms = {
    appid: props.appid,
    starttime: getYearMonthDay(props.date),
    endtime: getYearMonthDay(new Date(props.date).getTime() + 24 * 3600 * 1000)
  }

  const { data: resError } = await getProjectErrorInfo(parms)
  const { data: resNetwork } = await getProjectNetworkInfo(parms)
  

  let jsErrorData = resError.data.filter(item => item.type !== 'resource')
  let apiError = resNetwork.data.filter(item => { if (item.status < 200 || item.status >= 300) return true })
  let resourceErrorData = resError.data.filter(item => item.type === 'resource')

  let all = [jsErrorData, apiError, resourceErrorData]
  for (let index = 0; index < all.length; index++) {
    const element = all[index];
    option.value.series[0].data[index].value = element.length
  }

})


</script>

<style scoped>

</style>