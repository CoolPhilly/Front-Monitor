<!--Echarts组件-->
<template>
  <div ref="mychart"  :style="{ width: width, height: height }"></div>
</template>
   
<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ECBasicOption, EChartsType } from 'echarts/types/dist/shared'
import { mainStore } from "@/stores/index";

const store = mainStore()

const props = defineProps({ options: Object, width: String, height: String })

const mychart = ref()

let instance: EChartsType = null as unknown as EChartsType

// 初始化图表
const initEcharts = () => {
  if (props.options == null) return
  instance = echarts.init(mychart.value) as unknown as EChartsType

  instance.setOption(props.options as ECBasicOption)
  window.onresize = handlerSize
  store.charts.push(instance);
  // console.log(store.charts);
}
function handlerSize() {
  for (var i = 0; i < store.charts.length; i++) {
    store.charts[i].resize();
  }
}


// function handlerClick(params: any) {
//     // console.log(params)
// }
// nextTick(()=>{
//      let charts = [];
//      let echartsList = document.querySelectorAll(".mychart"); 
//      for(var i = 0; i<echartsList.length; i++ ){
//        var myChart = echarts.init(echartsList[i] as HTMLElement) 
//        myChart.setOption(this.option);
//        charts.push(myChart);
//        myChart.setOption({
//          xAxis:{data: this.echartTime},
//          series:[{ data: this.echartDate[i]}]
//        });
//        charts.push(myChart);
//      }
//      window.addEventListener('resize',()=>{
//        for(var i = 0; i < charts.length; i++){
//          charts[i].resize();
//        }
//      })
//    })

onMounted(() => {
  initEcharts()
})
// onBeforeUnmount(() => {
//     if (instance.id) {
//         instance.dispose()
//     }
//     window.removeEventListener('onresize', handlerSize)
// })
// 监听数据变化
watch(props, () => {  
    if (instance.id) {
        instance.setOption(props.options as ECBasicOption)
    }
})
</script>
   
<style scoped lang="scss">

</style>