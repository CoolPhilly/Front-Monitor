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
                <el-date-picker style="margin-left: 1em;" v-model="dateValue" @change="handlechange"
                    type="datetimerange" size="large" :shortcuts="shortcuts" range-separator="To"
                    start-placeholder="Start date" end-placeholder="End date" />

            </div>

            <div class="contentform">
                <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                    height=" calc(100vh - 248px)" :default-sort="{ prop: 'date', order: 'descending' }">
                    <el-table-column label="序号" width="60">
                        <template v-slot="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="uuid" label="用户编号" width="290" />
                    <el-table-column prop="type" label="类型" width="90" />
                    <el-table-column prop="url" label="请求地址" width="400"/>
                    <el-table-column prop="protocol" label="请求协议"  />
                    <el-table-column prop="dns" label="DNS" />
                    <el-table-column prop="redirect" label="重定向" />
                    <el-table-column prop="tcp" label="TCP" />
                    <el-table-column prop="ttfb" label="TTFB" />
                    <el-table-column prop="duration" label="耗时"  />
                    <el-table-column prop="time" label="日期" fixed="right"  sortable width="180" />
                </el-table>
                <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total" />
            </div>


        </el-card>



    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getProjectList } from "@/api/project";
import { getProjectResourceInfo } from "@/api/projectinfo";
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
    getProjectResourceInfoAgain()
}


// 初始化
const getProjectListAgain = async () => {
    const { data: res } = await getProjectList()
    options.value = res.data
    appValue.value = options.value[0]?.appid
    console.log(appValue.value);
    getProjectResourceInfoAgain()

}
getProjectListAgain()

// 获取项目资源信息
const getProjectResourceInfoAgain = async () => {
    let parms = {
        appid: appValue.value,
        starttime: timestampToTime(dateValue.value[0]),
        endtime: timestampToTime(dateValue.value[1])
    }

    const { data: res } = await getProjectResourceInfo(parms)
    // 转化json格式的时间
    let newData = res.data.map(item => {

        return {
            uuid: item.uuid,
            url: item.url,
            type: item.sourceType,
            protocol: item.protocol,
            duration: item.duration,
            dns: item.dns,
            redirect: item.redirect,
            tcp: item.tcp,
            ttfb: item.ttfb,
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
