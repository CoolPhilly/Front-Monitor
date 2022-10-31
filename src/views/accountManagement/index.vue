<template>
    <div>

        <el-card>
            <div class="queryform">
               <span>用户名:</span><el-input placeholder="请输入" v-model="search" clearable></el-input>
            
            </div>

            <div class="contentform">
                <el-table :data="newtableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                  height=" calc(100vh - 248px)"
                    :default-sort="{ prop: 'date', order: 'descending' }">
                    <el-table-column label="序号" >
                        <template v-slot="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="username" label="用户名"  />
                    <el-table-column prop="nickname" label="昵称" />
                    <el-table-column prop="time" label="日期" sortable  />
                    <el-table-column fixed="right" label="Operations" width="120">
                        <template #default>
                            <el-button link type="primary" size="small" @click="handleClick">Detail</el-button>
                            <el-button link type="primary" size="small">Edit</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total" />
            </div>


        </el-card>



    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAccounts } from "@/api/user";
import timestampToTime from "@/utils/timestampToTime";



// 条件选择

const search = ref('')
const newtableData = computed(() => {
    if (search) {
        return tableData.value.filter(item => item.username.includes(search.value))
    }
    return tableData.value
})


// 获取所有帐号
const getAccountsAgain = async () => {


    const { data: res } = await getAccounts()
    // 转化json格式的时间
    let newData = res.data.map(item => {

        return {
            username: item.username,
            nickname: item.nickname,
            time: timestampToTime(new Date(item.time).getTime()),
        }

    })


    total.value = newData.length
    tableData.value = newData


}
getAccountsAgain()



// 表格内容

const tableData = ref([])
const handleClick = () => {
    console.log('click')
}



// 分页器

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)


</script>

<style lang="scss" scoped>
.queryform {
    display: inline-flex;
    margin-bottom: 1em;
    align-items: center;
    span{
       width: 80px; 
    }
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
