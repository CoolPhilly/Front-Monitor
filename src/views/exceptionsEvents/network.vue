<template>
  <div>

    <el-card>
      <div class="queryform">
        <el-select v-model="appValue" placeholder="请去项目管理中添加" size="large" @change="handlechange">
          <template #prefix>
            <img src="/vue.svg" width="30" alt="">
          </template>
          <el-option v-for="item in options" :key="item.appid" :label="item.appname" :value="item.appid">

            <span style="float: left"><img src="/vue.svg" width="30" alt=""></span>
            <span style=" padding-left: 1em;">{{ item.appname }}</span>
          </el-option>
        </el-select>
        <el-date-picker style="margin-left: 1em;" v-model="dateValue" @change="handlechange" type="datetimerange"
          size="large" :shortcuts="shortcuts" range-separator="To" start-placeholder="Start date"
          end-placeholder="End date" />

      </div>

      <div class="contentform">
        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" height=" calc(100vh - 248px)"
          :default-sort="{ prop: 'date', order: 'descending' }">
          <el-table-column label="序号" width="60">
            <template v-slot="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column prop="uuid" label="用户编号" width="290" />
          <el-table-column prop="type" label="类型" width="90" />
          <el-table-column prop="url" label="请求地址" />
          <el-table-column prop="status" label="状态码" width="90"/>
          <el-table-column prop="duration" label="耗时" width="90"/>
          <el-table-column prop="method" label="方法" width="90"/>
          <el-table-column prop="time" label="日期" sortable width="180" />
        </el-table>
        <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper" :total="total" />
      </div>


    </el-card>



  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getProjectList } from "@/api/project";
import { getProjectNetworkInfo } from "@/api/projectinfo";
import timestampToTime from "@/utils/timestampToTime";



// 条件选择
const options = ref([])
const appValue = ref('')
const dateValue = ref([Date.now() - 3600 * 1000 * 24, Date.now()])

const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
]

const handlechange = () => {
  getProjectNetworkInfoAgain()
}


// 初始化
const getProjectListAgain = async () => {
  const { data: res } = await getProjectList()
  options.value = res.data
  appValue.value = options.value[0]?.appid
  console.log(appValue.value);
  getProjectNetworkInfoAgain()

}
getProjectListAgain()

// 获取项目网络信息
const getProjectNetworkInfoAgain = async () => {
  let parms = {
    appid: appValue.value,
    starttime: timestampToTime(dateValue.value[0]),
    endtime: timestampToTime(dateValue.value[1])
  }

  const { data: res } = await getProjectNetworkInfo(parms)
  // 转化json格式的时间
  let newData = res.data.map(item => {
    return {
      uuid: item.uuid,
      appid: item.appid,
      url: item.url,
      type: item.type,
      status: item.status,
      duration: item.duration,
      method: item.method,
      time: timestampToTime(new Date(item.time).getTime()),

    }
   
  })

  total.value = newData.length
  tableData.value = newData

}




// 表格内容

const tableData = ref([])


// 分页器

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)


</script>

<style lang="scss" scoped>
.queryform {
  display: inline-flex;
  margin-bottom: 1em;
}

.contentform {
  .el-table {
    margin-bottom: 1em;
  }

  .el-pagination {
    justify-content: flex-end
  }
}
</style>
