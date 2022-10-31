<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>性能趋势图</span>
      </div>
    </template>
    <ECharts :options="option" :width="'100%'" :height="'348px'"></ECharts>
  </el-card>
</template>

<script setup lang="ts">
import ECharts from '@/components/echarts/echarts.vue';
import { ref, watch } from 'vue'
import { getProjectRenderInfo } from "@/api/projectinfo"
import { getMonth, getYearMonthDay } from "@/utils/timestampToTime";

const props = defineProps(['appid'])

const option = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['First Paint', 'First Contentful Paint', 'Largest Contentful Paint', 'DOM Content Loaded', 'Load']
  },
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
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [...new Array(30)].map((_item, index) => `${getMonth(Date.now() - index * 24 * 60 * 60 * 1000)}`).reverse(),
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'First Paint',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'First Contentful Paint',
      type: 'line',
      data: [220, , 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210 ,182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Largest Contentful Paint',
      type: 'line',
      data: [220, , 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'DOM Content Loaded',
      type: 'line',
      data: [220, , 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Load',
      type: 'line',
      data: [220, , 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330, 310]
    }
  ]
})


watch(props, async () => {
  // console.log(props.appid);
  // 获取项目渲染信息

  let dateArr = [...new Array(30)].map((_item, index) => `${getYearMonthDay(Date.now() - index * 24 * 60 * 60 * 1000)}`).reverse()
  for (let item of dateArr) {

    let parms = {
      appid: props.appid,
      starttime: getYearMonthDay(item),
      endtime: getYearMonthDay(new Date(item).getTime() + 24 * 3600 * 1000)
    }

    const { data: res } = await getProjectRenderInfo(parms)
    
    let FP = res.data.filter(item => item.type === 'FP')
    let FCP = res.data.filter(item => item.type === 'FCP')
    let LCP = res.data.filter(item => item.type === 'LCP')
    let DOMContentLoaded = res.data.filter(item => item.type === 'DOMContentLoaded')
    let load = res.data.filter(item => item.type === 'load')
   
    let all = [FP, FCP, LCP, DOMContentLoaded, load]

    for (let index = 0; index < all.length; index++) {
        // 超过数值清空 
      if (option.value.series[index].data.length >= 30) option.value.series[index].data = []
      const element = all[index];
      let sum = 0
      element.map(item => item.duration).forEach(element => {
        sum += element
      })
      //   0/0 为nan显示异常
      option.value.series[index].data.push(sum / element.length ? sum / element.length : 0)
    }

  }

})



</script>

<style scoped>

</style>