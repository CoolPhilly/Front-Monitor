<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>PV/UV趋势图</span>
      </div>
    </template>
    <ECharts :options="option" :width="'100%'" :height="'400px'"></ECharts>
  </el-card>
</template>

<script setup lang="ts">
import ECharts from '@/components/echarts/echarts.vue';
import { watch, ref } from 'vue'
import { getMonth, getYearMonthDay } from "@/utils/timestampToTime";
import { getProjectUserInfo } from "@/api/projectinfo"


const props = defineProps(['appid', 'date'])
// console.log(props.appid, 'props.appid');
const emit = defineEmits(['changeloading'])

const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        width: 1,
        color: '#019680',
      },
    },
  },
  legend: {
    show: true,
    right: "0%"
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [...new Array(30)].map((_item, index) => `${getMonth(Date.now() - index * 24 * 60 * 60 * 1000)}`).reverse(),
    splitLine: {
      show: true,
      lineStyle: {
        width: 1,
        type: 'solid',
        color: 'rgba(226,226,226,0.5)',
      },
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: [
    {
      type: 'value',

      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255,255,255,0.2)', 'rgba(226,226,226,0.2)'],
        },
      },
    },
  ],
  grid: { left: '1%', right: '1%', top: '8%', bottom: '12%', containLabel: true },
  dataZoom: [
    {
      type: 'inside',
      start: 66,
      end: 100
    },
    {
      start: 66,
      end: 100
    }
  ],
  series: [
    {
      smooth: true,
      name: 'PV',
      // data: pvData.value,
      data: [
        11, 22, 400, 180, 333, 555, 666, 333, 140, 300, 666, 444, 222,
        111, 40, 20, 50, 33, 22, 11, 11, 22, 400, 180, 333, 555, 666, 333, 140, 301
      ],
      type: 'line',
      areaStyle: {},
      itemStyle: {
        color: '#5ab1ef',
      },
    },
    {
      smooth: true,
      name: 'UV',
      // data: uvData.value,
      data: [
        33, 66, 88, 33, 333, 500, 180, 300, 120, 100, 200, 100, 21, 11, 39,
        198, 60, 30, 22, 11, 33, 66, 88, 33, 333, 500, 180, 300, 120, 100, 200, 100, 21, 11, 39,
        198, 60, 30, 22, 11,
      ],
      type: 'line',
      areaStyle: {},
      itemStyle: {
        color: '#019680',
      },
    },
  ],
});



watch(props, async () => {
  // console.log(props.appid);
  // 获取项目用户信息
  let dateArr = [...new Array(30)].map((_item, index) => `${getYearMonthDay(Date.now() - index * 24 * 60 * 60 * 1000)}`).reverse()
  for (let item of dateArr) {

    let parms = {
      appid: props.appid,
      starttime: getYearMonthDay(item),
      endtime: getYearMonthDay(new Date(item).getTime() + 24 * 3600 * 1000)
    } 

    const { data: res } = await getProjectUserInfo(parms)

    let pvDay = res.data.filter(item => item.type === 'pv')
    let uvDay = [...new Set(res.data.map(item => item.uuid))]

    let all = [pvDay, uvDay]
    for (let index = 0; index < all.length; index++) {
      // 超过数值清空 
      if (option.value.series[index].data.length >= 30) option.value.series[index].data = []
      const element = all[index];
      option.value.series[index].data.push(element.length)
    }
    
  }
  emit('changeloading', false)

})




</script>

<style scoped>

</style>