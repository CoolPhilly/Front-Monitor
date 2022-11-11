<template>
    <dv-full-screen-container style="background: #111839;">
        <dv-loading v-if="loading">
            <div style="color:#fff">
                Loading...
            </div>
        </dv-loading>
        <div class="title">

            <h1>{{ appname }}</h1>
            <div class="header-r">
                <span>{{ date }}</span>
            </div>
        </div>
        <dv-border-box-1 class="main-container">
            <div class="border-box1-content">

                <dv-border-box8 :dur="5" class="left-top-container">
                    <div class="info ">
                        <div class="info-x">
                            <span>{{ errorData.length }}</span>
                        </div>
                        <div class="desc-x">
                            <span>JS错误数</span>
                        </div>

                    </div>
                    <dv-decoration6 style="width:100%;height:10px;" />
                    <div class="info ">
                        <div class="info-x">
                            <span>{{ failData.length }}</span>
                        </div>
                        <div class="desc-x">
                            <span>API错误数</span>
                        </div>

                    </div>
                </dv-border-box8>

                <dv-border-box9 class="middle-top-container">
                    <Pvuv :appid="$route.query.appid" :height="142" @changeloading="(n) => loading = n"></Pvuv>
                </dv-border-box9>

                <dv-border-box8 :dur="5" class="right-top-container">
                    <div class="info ">
                        <div class="info-x">
                            <span>{{ renderTime / loadArr.length ? (renderTime / loadArr.length).toFixed(2)
                                    : 0
                            }}ms</span>
                        </div>
                        <div class="desc-x">
                            <span>首次渲染耗时</span>
                        </div>

                    </div>
                    <dv-decoration6 style="width:100%;height:10px;" />
                    <div class="info ">
                        <div class="info-x">
                            <span>{{ ResourceErrorData.length }}</span>
                        </div>
                        <div class="desc-x">
                            <span>资源错误</span>
                        </div>

                    </div>
                </dv-border-box8>
            </div>

            <div class="border-box2-content">
                <dv-border-box10 class="left-middle-container">
                    <div class="info">
                        <span class="info-x">项目健康度</span>
                        <dv-water-level-pond :config="config" style="width:150px;height:150px" />
                    </div>
                    <dv-decoration2 :dur="2" style="width:100%;height:5px;" />
                    <error :appid="$route.query.appid"></error>
                </dv-border-box10>
                <dv-border-box7 :dur="5" class="right-middle-container">
                    <performance :appid="$route.query.appid"></performance>
                    <dv-decoration2 :dur="2" style="width:100%;height:5px;" />
                    <errorTrend :appid="$route.query.appid"></errorTrend>
                </dv-border-box7>
            </div>
        </dv-border-box-1>
    </dv-full-screen-container>

</template>
<script lang="ts" setup>
import { reactive, ref, onBeforeUnmount } from 'vue';

import Pvuv from './components/pvuv.vue'
import error from './components/error.vue'
import performance from './components/performance.vue'
import errorTrend from "./components/errorTrend.vue"
import timestampToTime from "@/utils/timestampToTime";
import { getProjectErrorInfo, getProjectNetworkInfo, getProjectRenderInfo } from "@/api/projectinfo"
import { getProjectList } from "@/api/project"
import { getYearMonthDay } from "@/utils/timestampToTime"
import { useRoute } from 'vue-router'


// 初始化
const route = useRoute()

const loading = ref(true)

const date = ref('')
const timer = setInterval(() => {
    date.value = timestampToTime(Date.now())
}, 1000)

onBeforeUnmount(() => {
    timer && clearInterval(timer)
})


const appname = ref('')
const getProjectListAgain = async () => {
    const { data: res } = await getProjectList()
    res.data.forEach(item => {
        if (item.appid === route.query.appid) appname.value = item.appname

    })

}

getProjectListAgain()


const config = reactive({
    data: [80],
    shape: 'round',
    waveNum: 2,
    waveHeight: 15
})



// 获取项目错误信息

const errorData = ref([])
const ResourceErrorData = ref([])
const getProjectErrorInfoAgain = async () => {
    let parms = {
        appid: route.query.appid,
        starttime: getYearMonthDay(Date.now()),
        endtime: getYearMonthDay(Date.now() + 24 * 3600 * 1000)
    }


    const { data: res } = await getProjectErrorInfo(parms)
    // console.log(res);
    errorData.value = res.data
    ResourceErrorData.value = res.data.filter(item => item.type === 'resource');

}
// 获取项目网络信息

// const successData = ref([])
const failData = ref([])
// API错误率
// const APIErrorOdds = ref(0)
const getProjectNetworkInfoAgain = async () => {
    let parms = {
        appid: route.query.appid,
        starttime: getYearMonthDay(Date.now()),
        endtime: getYearMonthDay(Date.now() + 24 * 3600 * 1000)
    }

    const { data: res } = await getProjectNetworkInfo(parms)
    // console.log(res, 'resresresresresresres');


    // successData.value = res.data.filter(item => { if (item.status >= 200 && item.status <= 299) return true })
    failData.value = res.data.filter(item => { if (item.status < 200 || item.status >= 300) return true })
    // console.log(successData.value, 'successData.value ');
    // console.log(failData.value, 'failData.value ');
    //failData.value.length /(failData.value.length + successData.value.length)
    // let sum = failData.value.length / (failData.value.length + successData.value.length) * 100 || 0
    // APIErrorOdds.value = +sum.toFixed(2)
    // APIErrorOdds.value = failData.value.length / (failData.value.length + successData.value.length) * 100
}

// 获取项目渲染信息

const renderTime = ref(0)
let loadArr = ref([])
const getProjectRenderInfoAgain = async () => {
    let parms = {
        appid: route.query.appid,
        starttime: getYearMonthDay(Date.now()),
        endtime: getYearMonthDay(Date.now() + 24 * 3600 * 1000)
    }

    const { data: res } = await getProjectRenderInfo(parms)
    loadArr.value = res.data.filter(item => item.type === 'load')
    // console.log(loadArr);
    renderTime.value = 0 // 清空上次的renderTime
    loadArr.value.forEach(element => {
        renderTime.value += element.duration
    });

}
getProjectErrorInfoAgain()
getProjectNetworkInfoAgain()
getProjectRenderInfoAgain()


</script>
<style lang="scss" scoped>
.title {
    background: url('@/assets/layout-header.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;

    h1 {
        line-height: 3rem;
        color: #fff;
        opacity: 0.8;
    }

    .header-r {
        position: absolute;
        right: 1%;
        color: #fff;
        opacity: 0.8;
    }
}

.main-container {
    height: calc(100% - 50px);
}

.border-box1-content {
    display: flex;
    padding: 20px;

    .left-top-container {
        width: 20%;
        padding: 20px;
        background-color: rgba(6, 30, 93, .5);
    }

    .middle-top-container {
        padding: 20px;
    }

    .right-top-container {
        width: 20%;
        padding: 20px;
        background-color: rgba(6, 30, 93, .5);
    }

    .info {
        padding: 20px;
        color: #fff;
        opacity: 0.8;

        .info-x {
            padding-bottom: 1rem;
            font-size: 32px;
            font-weight: 700;
        }

        .desc-x {
            color: #A2A2A3;
            font-size: small;
        }
    }
}

.border-box2-content {
    display: flex;
    padding: 0 20px;

    .left-middle-container {
        width: 30%;
        background-color: rgba(6, 30, 93, .5);

        .info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 15px 20px;

            .info-x {
                font-size: larger;
                color: #fff;
                margin-bottom: 1em;
            }
        }
    }


    .right-middle-container {
        padding: 20px;
        background-color: rgba(6, 30, 93, .5);
    }
}
</style>