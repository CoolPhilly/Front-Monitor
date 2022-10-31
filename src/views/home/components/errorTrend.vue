<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>异常趋势图</span>
            </div>
        </template>
        <ECharts :options="option" :width="'100%'" :height="'348px'"></ECharts>
    </el-card>
</template>

<script setup lang="ts">
import ECharts from '@/components/echarts/echarts.vue';
import * as echarts from 'echarts'
import { ref, watch } from 'vue'
import { getProjectErrorInfo, getProjectNetworkInfo } from "@/api/projectinfo"
import { getMonth, getYearMonthDay } from "@/utils/timestampToTime";


const props = defineProps(['appid'])
const option = ref( {
    color: ['#80FFA5', '#00DDFF', '#37A2FF'],

    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['JS异常', '接口异常', '资源异常']
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
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: [...new Array(30)].map((_item, index) => `${getMonth(Date.now() - index * 24 * 60 * 60 * 1000)}`).reverse(),
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'JS异常',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 0
            },
            zlevel: 1,
            z: 1,
            showSymbol: false,
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgb(128, 255, 165)'
                    },
                    {
                        offset: 1,
                        color: 'rgb(1, 191, 236)'
                    }
                ])
            },
            emphasis: {
                focus: 'series'
            },
            data: [140, 232, 101, 264, 90, 340, 250, 232, 101, 264, 90, 340, 250, 232, 101, 264, 90, 340, 250, 232, 101, 264, 90, 340, 250, 232, 101, 264, 90, 340, 250]
        },
        {
            name: '接口异常',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 0
            },
            zlevel: 2,
            z: 2,
            showSymbol: false,
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgb(0, 221, 255)'
                    },
                    {
                        offset: 1,
                        color: 'rgb(77, 119, 255)'
                    }
                ])
            },
            emphasis: {
                focus: 'series'
            },
            data: [120, 282, 111, 234, 220, 340, 120, 282, 111, 234, 220, 310, 120, 282, 111, 234, 220, 340, 310, 120, 282, 111, 234, 220, 340, 310, 120, 282, 111, 234, 220, 340, 310]
        },
        {
            name: '资源异常',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 0
            },
            zlevel: 3,
            z: 3,
            showSymbol: false,
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgb(55, 162, 255)'
                    },
                    {
                        offset: 1,
                        color: 'rgb(116, 21, 219)'
                    }
                ])
            },
            emphasis: {
                focus: 'series'
            },
            data: [120, 282, 111, 234, 220, 111, 234, 220, 111, 234, 220, 111, 234, 220, 111, 234, 220, 111, 234, 220, 340, 120, 282, 340, 120, 282, 340, 120, 282, 111, 234, 220, 310, 120, 282, 111, 234, 220, 340, 310, 120, 282, 111, 234, 220, 340, 310, 120, 282, 111, 234, 220, 340, 310]
        },
    ]
})



watch(props, async () => {
    // console.log(props.appid);
    // 获取项目错误信息

    let dateArr = [...new Array(30)].map((_item, index) => `${getYearMonthDay(Date.now() - index * 24 * 60 * 60 * 1000)}`).reverse()
    for (let item of dateArr) {

        let parms = {
            appid: props.appid,
            starttime: getYearMonthDay(item),
            endtime: getYearMonthDay(new Date(item).getTime() + 24 * 3600 * 1000)
        }

        const { data: resError } = await getProjectErrorInfo(parms)
        const { data: resNetwork } = await getProjectNetworkInfo(parms)
        
        let jsErrorData = resError.data.filter(item => item.type !== 'resource')
        let apiError = resNetwork.data.filter(item => { if (item.status < 200 || item.status >= 300) return true })
        let resourceErrorData = resError.data.filter(item => item.type === 'resource')


        let all = [jsErrorData, apiError, resourceErrorData]
        for (let index = 0; index < all.length; index++) {
            // 超过数值清空 
            if (option.value.series[index].data.length >= 30) option.value.series[index].data = []
            const element = all[index];
            option.value.series[index].data.push(element.length)
        }

    }


})




</script>

<style scoped>

</style>