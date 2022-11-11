<template>
  <div v-loading="loading">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <el-select v-model="appValue" placeholder="请去项目管理中添加" size="large" @change="handlechange">
            <template #prefix>
              <img src="/vue.svg" width="30" alt="">
            </template>
            <el-option v-for="item in options" :key="item.appid" :label="item.appname" :value="item.appid">

              <span style="float: left"><img src="/vue.svg" width="30" alt=""></span>
              <span style=" padding-left: 1em;">{{ item.appname }}</span>
            </el-option>
          </el-select>
          <el-date-picker style="margin-left: 1em;" v-model="dateValue" @change="handlechange" type="date"
            :disabled-date="disabledDate" size="large" :clearable="false" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="center">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="box-card ">
          <div class="cardinfo-x">
            <span>{{ errorData.length }}</span>
          </div>
          <div class="carddesc-x">
            <span>JS错误数</span>
          </div>

        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="box-card changesize-xs">
          <div class="cardinfo">
            <span>{{ failData.length }}</span>
            <span>{{ APIErrorOdds }}%</span>
          </div>
          <div class="carddesc">
            <span>API错误数</span>
            <span>API错误率</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="box-card changesize">
          <div class="cardinfo-x">
            <span>{{ renderTime / loadArr.length ? (renderTime / loadArr.length).toFixed(2) :0}}ms</span>
          </div>
          <div class="carddesc-x">
            <span>首次渲染耗时</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="box-card changesize">
          <div class="cardinfo-x">
            <span>{{ResourceErrorData.length}}</span>
          </div>
          <div class="carddesc-x">
            <span>资源错误</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="center">
      <el-col :span="24">
        <Pvuv :appid = "appValue" :date = "dateValue" :height="400" @changeloading="(n) => loading = n "></Pvuv>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="center"> 
      <el-col :xs="24" :md="8">
        <error :appid = "appValue" :date = "dateValue" ></error>
      </el-col>
      <el-col :xs="24" :md="16">
        <errorTrend :appid = "appValue"></errorTrend>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <performance :appid = "appValue" class=" changesize changesize-xs"></performance>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Pvuv from './components/pvuv.vue'
import error from './components/error.vue'
import performance from './components/performance.vue'
import errorTrend from "./components/errorTrend.vue"
import { getProjectList } from "@/api/project"
import { getProjectErrorInfo, getProjectNetworkInfo, getProjectRenderInfo } from "@/api/projectinfo"
import { getYearMonthDay } from "@/utils/timestampToTime"



// 条件选择
const options = ref([])
const appValue = ref('')
const dateValue = ref(Date.now())
const loading = ref(true)

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
const handlechange = () => {
  loading.value = true
  getProjectErrorInfoAgain()
  getProjectNetworkInfoAgain()
  getProjectRenderInfoAgain()
  // getProjectResourceInfoAgain()
  // console.log(timestampToTime(dateValue.value));
  

}

// 初始化
const getProjectListAgain = async () => {
  const { data: res } = await getProjectList()
  console.log(res);
  
  options.value = res.data
  appValue.value = options.value[0]?.appid
  handlechange()
  // console.log(appValue.value, getYearMonthDay(dateValue.value));
}

getProjectListAgain()





// 获取项目错误信息

const errorData = ref([])
const ResourceErrorData = ref([])
const getProjectErrorInfoAgain = async () => {
  let parms = {
    appid: appValue.value,
    starttime: getYearMonthDay(dateValue.value),
    endtime: getYearMonthDay(new Date(dateValue.value).getTime() + 24 * 3600 * 1000)
  }


  const { data: res } = await getProjectErrorInfo(parms)
  // console.log(res);
  errorData.value = res.data
  ResourceErrorData.value = res.data.filter(item => item.type === 'resource');

}

// 获取项目网络信息

const successData = ref([])
const failData = ref([])
// API错误率
const APIErrorOdds = ref(0)
const getProjectNetworkInfoAgain = async () => {
  let parms = {
    appid: appValue.value,
    starttime: getYearMonthDay(dateValue.value),
    endtime: getYearMonthDay(new Date(dateValue.value).getTime() + 24 * 3600 * 1000)
  }

  const { data: res } = await getProjectNetworkInfo(parms)
  console.log(res,'resresresresresresres');
  
  successData.value = res.data.filter(item => { if (item.status >= 200 && item.status <= 299) return true })
  failData.value = res.data.filter(item => { if (item.status < 200 || item.status >= 300) return true })
  // console.log(successData.value, 'successData.value ');
  // console.log(failData.value, 'failData.value ');
  //failData.value.length /(failData.value.length + successData.value.length)
  let sum =   failData.value.length / (failData.value.length + successData.value.length) * 100 || 0
  APIErrorOdds.value = +sum.toFixed(2)
  // APIErrorOdds.value = failData.value.length / (failData.value.length + successData.value.length) * 100
}

// 获取项目渲染信息

const renderTime = ref(0)
let loadArr = ref([])
const getProjectRenderInfoAgain = async () => {
  let parms = {
    appid: appValue.value,
    starttime: getYearMonthDay(dateValue.value),
    endtime: getYearMonthDay(new Date(dateValue.value).getTime() + 24 * 3600 * 1000)
  }

  const { data: res } = await getProjectRenderInfo(parms)
  loadArr.value =  res.data.filter( item => item.type === 'load')
  // console.log(loadArr);
  renderTime.value = 0 // 清空上次的renderTime
  loadArr.value.forEach(element => {
    renderTime.value += element.duration
  });

}

// 获取项目资源信息
// const getProjectResourceInfoAgain = async () => {
//   let parms = {
//     appid: appValue.value,
//     starttime: getYearMonthDay(dateValue.value),
//     endtime: getYearMonthDay(new Date(dateValue.value).getTime() + 24 * 3600 * 1000)
//   }

//   const { data: res } = await getProjectResourceInfo(parms)
//   console.log(res);
  

// }




</script>
  

<style lang="scss" scoped>
.center {
  margin: 16px 0;

}

@media (max-width:992px) {
  .changesize {
    margin-top: 16px;
  }
}

@media (max-width:750px) {
  .changesize-xs {
    margin-top: 16px;
  }
}


.cardinfo {
  display: flex;
  padding: 0 0 1rem 1rem;
  justify-content: space-between;
  font-size: 32px;
  font-weight: 700;
}

.carddesc {
  display: flex;
  justify-content: space-between;
  color: #A2A2A3;
  font-size: small;
  padding-right: 1rem;
}

.cardinfo-x {
  display: flex;
  justify-content: center;
  padding-bottom: 1rem;
  font-size: 32px;
  font-weight: 700;
}

.carddesc-x {
  display: flex;
  justify-content: center;
  color: #A2A2A3;
  font-size: small;
}

.box-card {
  width: 100%;
}

// 修改loading的图标位置
:deep(.el-loading-spinner ) {
  top: 17%;
}
</style>
